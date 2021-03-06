const express = require('express');
const moment = require('moment');

const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

const Employee = require('../classes/Employee');
const Moment = require('../classes/Moment');
const Request = require('../classes/Request');
const RequestController = require('../controllers/RequestController');
const RequestStatus = require('../classes/RequestStatus');
const RequestUnit = require('../classes/RequestUnit');
const User = require('../classes/User');

const parseInteger = (input) => {
    const parsed = parseInt(input);
    if (isNaN(parsed)) {
        return null;
    }
    return parsed;
}

const parseBoolean = (input) => {
    if (input === undefined) {
        return null;
    }
    return Boolean(input);
}

// Route GET /api/request
// Returns an array all requested days off for all users
router.get('/', rejectUnauthenticated, (req, res) => {
    const employee = parseInteger(req.query.employee);
    const status = parseInteger(req.query.status);
    const active = parseBoolean(req.query.active);
    const leave = parseInteger(req.query.leave);
    const start = new Moment(req.query.startDate, Moment.format.HTTP);
    const end = new Moment(req.query.endDate, Moment.format.HTTP);

    const client = new RequestController(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const requests = await client.getRequests(employee, status, active, leave, start.formatDatabase(), end.formatDatabase());
            await client.commit();
            res.send(requests);
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

// Route GET /api/request/year-available
// Returns list of available years
router.get('/year-available', rejectUnauthenticated, (req, res) => {
    const employee = parseInteger(req.query.employee);
    const status = parseInteger(req.query.status);
    const leave = parseInteger(req.query.leave);

    const client = new RequestController(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const years = await client.getYears(employee, status, leave);
            await client.commit();
            res.send(years);
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
        console.log('SQL error using GET /api/request/year-available');
    });
});

// Route GET /api/request/count
// Returns number of requests that satisfy the optional filters
router.get('/count', rejectUnauthenticated, (req, res) => {
    const employee = parseInteger(req.query.employee);
    const status = parseInteger(req.query.status);
    const active = parseBoolean(req.query.active);
    const leave = parseInteger(req.query.leave);
    const start = new Moment(req.query.startDate, Moment.format.HTTP);
    const end = new Moment(req.query.endDate, Moment.format.HTTP);

    const client = new RequestController(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const count = await client.getCount(employee, status, active, leave, start.formatDatabase(), end.formatDatabase());
            await client.commit();
            res.send({ count });
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
        console.log('SQL error using GET /api/request/count');
    });
});

// Route POST /api/request
// User adds requested time-off to the database
router.post('/', rejectUnauthenticated, (req, res) => {
    const user = new User(req.user);
    const employeeID = req.body.employee;
    const type = parseInteger(req.body.type);
    const status = parseInteger(req.body.status);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const specialEdit = req.body.specialEdit && user.isAdministrator();

    if (employeeID === undefined || type === undefined || status === undefined || startDate === undefined || endDate === undefined) {
        res.sendStatus(400);
        return;
    }
    if (!user.isAdministrator() && (employeeID != user.id || status !== RequestStatus.code.PENDING)) {
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

    const client = new RequestController(pool);
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
    const newStatus = new RequestStatus(req.body.requestStatus);

    const client = new RequestController(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            const currentStatus = request.status;
            await client.updateStatus(id, newStatus);
            if (newStatus.denied && newStatus.lookup !== currentStatus) {
                await client.refundHours(request);
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
    const specialEdit = parseBoolean(req.query.specialEdit);

    const client = new RequestController(pool);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const request = await client.getRequestData(id);
            if (user.isAdministrator() || (user.id === request.employee && request.in_future)) {
                const refund = true;
                await client.deleteRequest(request, refund);
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