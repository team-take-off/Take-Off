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

    console.log('startDate: ', moment(startDate).format());
    console.log('  endDate: ', moment(endDate).format());

    const units = RequestUnit.findUnits(startDate, endDate);
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
// Update the value of approved for a batch of requested days off
router.put('/:id', rejectNonAdmin, (req, res) => {
    const id = req.params.id;
    const requestStatus = req.body.requestStatus;
    const status = new RequestStatus(req.body.requestStatus);

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            await client.updateStatus(id, requestStatus);
            if (status.denied && requestStatus !== request.status) {
                await client.refundHours(request, req.user.id, TransactionCodes.ADMIN_DENY);
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
    const user = new User(req.user);
    const adminEdit = user.isAdministrator() && req.query.adminEdit;

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            if (user.isAdministrator()) {
                if (adminEdit) {
                    await client.deleteRequest(request, user.id, adminEdit, TransactionCodes.ADMIN_SPECIAL);
                } else {
                    await client.deleteRequest(request, user.id, adminEdit, TransactionCodes.ADMIN_DENY);
                }
            } else if (user.id === request.employee && request.in_future) {
                await client.deleteRequest(request, user.id, adminEdit, TransactionCodes.EMPLOYEE_CANCEL);
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