const express = require('express');
const moment = require('moment');

const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

const Employee = require('../classes/Employee');
const Request = require('../classes/Request');
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
    const employeeID = req.body.employee;
    const type = Number(req.body.type);
    const status = Number(req.body.status);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const specialEdit = req.body.specialEdit && user.isAdministrator();

    if (employeeID === undefined || type === undefined || status === undefined || startDate === undefined || endDate === undefined) {
        res.sendStatus(400);
        return;
    }
    if ((employeeID != user.id || status !== RequestStatus.code.PENDING) && !user.isAdministrator()) {
        res.sendStatus(403);
        return;
    }

    const units = RequestUnit.findUnits(startDate, endDate);
    if (units.length === 0) {
        res.sendStatus(201);
        return;
    }
    const startDateTrimmed = units[0].startDate;
    const endDateTrimmed = units[units.length - 1].endDate;
    const employee = new Employee(employeeID);
    const request = new Request(undefined, employee, type, status, startDateTrimmed, endDateTrimmed);
    request.setUnits(units);

    const client = new RequestClient(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            await client.insertRequest(request, specialEdit);
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