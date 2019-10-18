const express = require('express');
const moment = require('moment');

const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

const RequestClient = require('../classes/RequestClient');
const RequestStatus = require('../classes/RequestStatus');
const RequestUnit = require('../classes/RequestUnit');
const TransactionCodes = require('../constants/TransactionCodes');
const User = require('../classes/User');

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
            const pending = await client.getRequests(RequestStatus.code.PENDING);
            const approved = await client.getRequests(RequestStatus.code.APPROVED);
            const denied = await client.getRequests(RequestStatus.code.DENIED);
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
            const pending = await client.getRequests(RequestStatus.code.PENDING);
            const approved = await client.getRequests(RequestStatus.code.APPROVED);
            const denied = await client.getRequests(RequestStatus.code.DENIED);
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
    const user = new User(req.user);
    const adminEdit = user.isAdministrator() && req.query.adminEdit;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    let employee;
    let status;
    if (adminEdit) {
        employee = parseIntOrNull(req.body.employee);
        status = parseIntOrNull(req.body.status);
    } else {
        employee = parseIntOrNull(req.user.id);
        status = RequestStatus.code.PENDING;
    }

    const config = {
        adminEdit: adminEdit,
        employee: employee,
        type: parseIntOrNull(req.body.typeID),
        status: status,
    };

    const startMoment = moment(startDate, 'YYYY-MM-DDTHH:mm:ssZ').utc();
    const endMoment = moment(endDate, 'YYYY-MM-DDTHH:mm:ssZ').utc();

    const units = RequestUnit.findUnits(startMoment, endMoment);
    if (units.length === 0) {
        res.sendStatus(201);
        return;
    }
    startDate = units[0].startDate;
    endDate = units[units.length - 1].endDate;

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const requestID = await client.insertRequest(startDate, endDate);
            for (let unit of units) {
                await client.insertRequestDay(unit, requestID);
            }
            await client.commit();
            await res.sendStatus(201);
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
// Update the status (pending, approved, denied) for a request
router.put('/:id', rejectNonAdmin, (req, res) => {
    const id = req.params.id;
    const user = new User(req.user);
    const newStatus = new RequestStatus(req.body.requestStatus);

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            const currentStatus = request.status;
            await client.updateStatus(id, newStatus);
            if (newStatus.denied && newStatus.lookup !== currentStatus) {
                await client.refundHours(request, user, TransactionCodes.ADMIN_DENY);
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
// Removes a time off request
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const id = req.params.id;
    const user = new User(req.user);
    const specialEdit = req.query.specialEdit;
    let transactionCode;
    if (user.isAdministrator() && specialEdit) {
        transactionCode = TransactionCodes.ADMIN_SPECIAL;
    } else if (user.isAdministrator()) {
        transactionCode = TransactionCodes.ADMIN_DENY;
    } else {
        transactionCode = TransactionCodes.EMPLOYEE_CANCEL;
    }

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            if (user.isAdministrator() || (user.id === request.employee && request.in_future)) {
                await client.deleteRequest(request, user, transactionCode);
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