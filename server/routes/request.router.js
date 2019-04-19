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

// Route GET /api/request
// Returns an array all requested days off for all users
router.get('/', rejectUnauthenticated, (req, res) => {
    const config = {
        year: req.body.year
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
        employee: req.user.id,
        year: req.body.year
    };

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const years = await client.getYears();
            const pending = await client.getEmployeeRequests(PENDING_STATUS);
            const approved = await client.getEmployeeRequests(APPROVED_STATUS);
            const denied = await client.getEmployeeRequests(DENIED_STATUS);
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
    // const userID = req.user.id;
    // const typeID = req.body.typeID;
    const requestedDates = req.body.requestedDates;
    const config = {
        employee: req.user.id,
        type: req.body.typeID
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
    const batchID = req.params.id;
    const requestStatus = req.body.requestStatus;
    const config = {
        // batch: req.params.id
    };

    const client = new RequestClient(pool, config);
    (async () => {
        await client.connect();
        try {
            await client.begin();
            const batch = await client.getBatchData(batchID);
            await client.updateBatchStatus(batchID, requestStatus);
            if (requestStatus === DENIED_STATUS && requestStatus !== batch.status) {
                await client.refundBatchHours(batch);
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