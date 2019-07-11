const express = require('express');
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
    const requestedDates = req.body.requestedDates;
    const config = {
        employee: parseIntOrNull(req.user.id),
        type: parseIntOrNull(req.body.typeID)
    };

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const batchID = await client.insertBatch();
            for (let request of requestedDates) {
                await client.insertRequest(request, batchID);
            }
            await client.commit();
            await res.sendStatus(201);
        } catch (error) {
            await client.rollback();
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
            }
            await client.commit();
            res.sendStatus(200);
        } catch (error) {
            await client.rollback();
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
    const batchID = req.params.id;

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            let employeeID = req.user.id;
            const batch = await client.getBatchData(batchID);
            if (req.user.role_id === ADMINISTRATOR_ROLE) {
                employeeID = batch.employee;
            } else if (employeeID !== batch.employee) {
                throw new Error('Attempted unautharized query on route DELETE /api/request/:id.');
            }

            if (batch.status === PENDING_STATUS) {
                // TODO: This should include a check to see if the deleted request is in the future and 
                // Prevent non-admin users from deleting in that case.
                await client.refundBatchHours(batch);
            }

            await client.deleteBatch(batch);
            await client.commit();
            res.sendStatus(200);
        } catch (error) {
            await client.rollback();
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