const express = require('express');
const moment = require('moment');
const momentHoliday = require('moment-holiday');

const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

const RequestClient = require('../classes/RequestClient');

const ADMINISTRATOR_ROLE = 1;
const EMPLOYEE_ROLE = 2;

const PENDING_STATUS = 1;
const APPROVED_STATUS = 2;
const DENIED_STATUS = 3;

const AUTOMATIC_ACCRUAL_TRANSACTION = 1;
const AUTOMATIC_ADJUSTMENT_TRANSACTION = 2;
const EMPLOYEE_REQUEST_TRANSACTION = 3;
const EMPLOYEE_CANCEL_TRANSACTION = 4;
const ADMIN_APPROVE_TRANSACTION = 5;
const ADMIN_DENY_TRANSACTION = 6;
const ADMIN_SPECIAL_TRANSACTION = 7;

const parseIntOrNull = (num) => {
    const parsed = parseInt(num);
    if (parsed) {
        return parsed;
    }
    return null;
}

const parseBoolOrNull = (bool) => {
    if (bool === undefined) {
        return null;
    }
    return bool;
}

const getRequestsArray = (startDate, endDate) => {
    let requests = [];
    let currentDate = moment(startDate);
    while (currentDate.isBefore(endDate)) {
        if (currentDate.day() === 0 || currentDate.day() === 6 || isCompanyHoliday(currentDate)) {
            currentDate.add(1, 'days');
            continue;
        }

        if (currentDate.hour() === 9) {
            const lookAheadFull = moment(currentDate).add(8, 'hours');
            const lookAheadHalf = moment(currentDate).add(4, 'hours');
            if (lookAheadFull.isSameOrBefore(endDate)) {
                const newRequest = {
                    start: moment(currentDate),
                    end: moment(lookAheadFull),
                    hours: 8
                };
                requests.push(newRequest);
            } else if (lookAheadHalf.isSameOrBefore(endDate)) {
                const newRequest = {
                    start: moment(currentDate),
                    end: moment(lookAheadHalf),
                    hours: 4
                };
                requests.push(newRequest);
            }
            currentDate.add(1, 'days');
        } else if (currentDate.hour() === 13) {
            const lookAhead = moment(currentDate).add(4, 'hours');
            if (lookAhead.isSameOrBefore(endDate)) {
                const newRequest = {
                    start: moment(currentDate),
                    end: moment(lookAhead),
                    hours: 4
                };
                requests.push(newRequest);
            }
            currentDate.add(20, 'hours');
        }
    }
    return requests;
}

const isCompanyHoliday = (currentDate) => {
    const observedHolidays = [
        'New Years Day',
        'Martin Luther King Jr. Day',
        'Washingtons Birthday',
        'Memorial Day',
        'Independence Day',
        'Labor Day',
        'Veterans Day',
        'Thanksgiving Day',
        'Christmas Eve',
        'Christmas Day'
    ];

    // Note: Library moment-holiday incorrectly finds 'Day after Thanksgiving'
    // for years where November 1st falls on Friday.
    if (currentDate.month() === 10 && currentDate.day() === 5 && currentDate.date() >= 23 && currentDate.date() < 30) {
        return true;
    }

    return currentDate.isHoliday(observedHolidays);
}

const getRequestUnits = (requestsArray) => {
    requestUnits = [];
    for (let request of requestsArray) {
        if (request.start.year() === request.end.year() && request.start.dayOfYear() === request.end.dayOfYear()) {
            if (request.start.hour() === 9 && request.end.hour() === 17) {
                requestUnits.push({
                    description: 'fullday',
                    hours: 8
                });
            } else if (request.start.hour() === 9 && request.end.hour() === 13) {
                requestUnits.push({
                    description: 'morning',
                    hours: 4
                });
            } else if (request.start.hour() === 13 && request.end.hour() === 17) {
                requestUnits.push({
                    description: 'afternoon',
                    hours: 4
                });
            }
        }
    }
    return requestUnits;
}

// Route GET /api/request
// Returns an array all requested days off for all users
router.get('/', rejectUnauthenticated, (req, res) => {
    const config = {
        employee: parseIntOrNull(req.query.employee),
        year: parseIntOrNull(req.query.year)
    };

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const years = await client.getYears();
            const pending = await client.getRequests(PENDING_STATUS);
            const approved = await client.getRequests(APPROVED_STATUS);
            const denied = await client.getRequests(DENIED_STATUS);
            const past = await client.getPastRequests();
            await client.commit();
            res.send({ years, pending, approved, denied, past });
        } catch (error) {
            await client.rollback();
            await console.log(error);
            await res.sendStatus(500);
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        console.error(error.stack);
        console.log('SQL error using GET /api/request');
    });
});

// Route GET /api/request/current-user
// Returns an array all requested days off for the currently authenticated user
router.get('/current-user', rejectUnauthenticated, (req, res) => {
    const config = {
        employee: parseIntOrNull(req.user.id),
        year: parseIntOrNull(req.query.year)
    };

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const years = await client.getYears();
            const pending = await client.getRequests(PENDING_STATUS);
            const approved = await client.getRequests(APPROVED_STATUS);
            const denied = await client.getRequests(DENIED_STATUS);
            const past = await client.getPastRequests();
            await client.commit();
            res.send({ years, pending, approved, denied, past });
        } catch (error) {
            await client.rollback();
            await console.log(error);
            await res.sendStatus(500);
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        console.error(error.stack);
        console.log('SQL error using GET /api/request/current-user');
    });
});

// Route POST /api/request
// User adds requested time-off to the database
router.post('/', rejectUnauthenticated, (req, res) => {
    const adminEdit = req.user.role_id === ADMINISTRATOR_ROLE && req.query.adminEdit;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    let employee;
    let status;
    if (adminEdit) {
        employee = parseIntOrNull(req.body.employee);
        status = parseIntOrNull(req.body.status);
    } else {
        employee = parseIntOrNull(req.user.id);
        status = PENDING_STATUS;
    }

    const config = {
        adminEdit: adminEdit,
        employee: employee,
        type: parseIntOrNull(req.body.typeID),
        status: status,
        dryRun: parseBoolOrNull(req.body.dryRun)
    };

    const requestsArray = getRequestsArray(startDate, endDate);
    const returnSummary = {
        totalHours: 0,
        requestUnits: getRequestUnits(requestsArray)
    };
    if (requestsArray.lenth === 0) {
        res.send(returnSummary);
        return;
    }

    startDate = requestsArray[0].start;
    endDate = requestsArray[requestsArray.length - 1].end;

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            returnSummary.totalHours = await client.getTotalHours();
            const requestID = await client.insertRequest(startDate, endDate);
            for (let day of requestsArray) {
                await client.insertRequestDay(day, requestID);
            }
            await client.commit();
            await res.send(returnSummary);
        } catch (error) {
            await client.rollback();
            await console.log(error);
            await res.sendStatus(500);
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        console.error(error.stack);
        console.log('SQL error using route POST /api/request');
    });
});

// Route PUT /api/request/:id
// Update the value of approved for a batch of requested days off
router.put('/:id', rejectNonAdmin, (req, res) => {
    const id = req.params.id;
    const requestStatus = req.body.requestStatus;

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            await client.updateStatus(id, requestStatus);
            if (requestStatus === DENIED_STATUS && requestStatus !== request.status) {
                await client.refundHours(request, req.user.id, ADMIN_DENY_TRANSACTION);
                await client.removeCollisions(request.id);
            }
            await client.commit();
            res.sendStatus(200);
        } catch (error) {
            await client.rollback();
            await console.log(error);
            await res.sendStatus(500);
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        console.error(error.stack);
        console.log('SQL error using PUT /api/request/:id');
    });
});

// Route DELETE /api/request/:id
// Removes a batch of requested days off belonging to one user (based on batch ID)
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const id = req.params.id;
    const adminEdit = req.user.role_id === ADMINISTRATOR_ROLE && req.query.adminEdit;
    const userID = req.user.id;
    const userRole = req.user.role_id;

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            if (userRole === ADMINISTRATOR_ROLE) {
                if (adminEdit) {
                    await client.deleteRequest(request, userID, adminEdit, ADMIN_SPECIAL_TRANSACTION);
                } else {
                    await client.deleteRequest(request, userID, adminEdit, ADMIN_DENY_TRANSACTION);
                }
            } else if (userID === request.employee && request.in_future) {
                await client.deleteRequest(request, userID, adminEdit, EMPLOYEE_CANCEL_TRANSACTION);
            } else {
                throw new Error('Unautharized use of route DELETE /api/request/:id.');
            } 
            await client.commit();
            res.sendStatus(200);
        } catch (error) {
            await client.rollback();
            await console.log(error);
            await res.sendStatus(500);
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        console.error(error.stack);
        console.log('SQL error using DELETE /api/request/:id');
    });
});

module.exports = router;