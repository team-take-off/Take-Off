const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Route GET /api/admin/request
// Returns an array all requested days off for all users
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        const queryText = `
        SELECT
            "time_off_request".*,
            "batch_of_requests"."date_requested",
            "employee"."first_name",
            "employee"."last_name",
            "type"."name" AS "type",
            "request_status"."name" AS "status"
        FROM "employee" 
        JOIN "batch_of_requests" ON "employee"."id" = "batch_of_requests"."employee_id"
        JOIN "type" ON "type".id = "batch_of_requests"."type_id"
        JOIN "request_status" ON "request_status"."id" = "batch_of_requests"."request_status_id"
        JOIN "time_off_request" ON "batch_of_requests"."id" = "time_off_request"."batch_of_requests_id"
        ORDER BY "date";
        `;
        pool.query(queryText).then((result) => {
            res.send(result.rows);
        }).catch((queryError) => {
            const errorMessage = `SQL error using GET /api/admin/request, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

// Route GET /api/admin/request/batch
// Returns all batches of requested days off
router.get('/batch', (req, res) => {
    if (req.isAuthenticated()) {
        const queryText = `
        SELECT * FROM "batch_of_requests";
        `;
        pool.query(queryText).then((result) => {
            res.send(result.rows)
        }).catch(queryError => {
            const errorMessage = `SQL error using GET /api/admin/request/batch, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        });
    }else {
        res.sendStatus(403);
    }
    
});

// Route POST /api/admin/request
// Insert an new batch of requested days off
router.post('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const userID = req.user.id;
        const typeID = req.body.requestType;
        const requestedDates = req.body.requestedDates;
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                const insertComparisonText = `
                INSERT INTO "batch_of_requests"
                    ("employee_id", "type_id")
                VALUES
                    ($1, $2)
                RETURNING id;
                `;
                const {
                    rows
                } = await client.query(insertComparisonText, [userID, typeID]);
                const batchID = rows[0].id;
                for (let request of requestedDates) {
                    const insertDateText = `
                    INSERT INTO "time_off_request"
	                    ("date", "batch_of_requests_id", "hours")
                    VALUES
	                    ($1, $2, $3);
                    `;
                    await client.query(insertDateText, [request.date, batchID, request.hours]);
                }
                await client.query('COMMIT');
                await res.sendStatus(201);
            } catch (error) {
                await client.query('ROLLBACK');
                await res.sendStatus(500);
                throw error;
            } finally {
                client.release();
            }
        })().catch((error) => {
            console.error(error.stack);
        });
    } else {
        res.sendStatus(403);
    }
});

// Route PUT /api/admin/request/:id
// Update the value of approved for a batch of requested days off
router.put('/:id', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const batchID = req.params.id;
        const requestStatus = req.body.requestStatus;
        const queryText = `
        UPDATE "batch_of_requests"
        SET "request_status_id" = $1
        WHERE "id" = $2;
        `;
        pool.query(queryText, [requestStatus, batchID]).then((queryResult) => {
            res.sendStatus(200);
        }).catch((queryError) => {
            const errorMessage = `SQL error using PUT /api/admin/request/:id, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

// Route DELETE /api/admin/request/:id
// Remove a batch of requested days off
router.delete('/:id', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const batchID = req.params.id;
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                const deleteRequestsText = `
                DELETE FROM "time_off_request"
                WHERE "batch_of_requests_id" = $1;
                `;
                await client.query(deleteRequestsText, [batchID]);
                const deleteBatchText = `
                DELETE FROM "batch_of_requests"
                WHERE "id" = $1
                RETURNING *;
                `;
                await client.query(deleteBatchText, [batchID]);
                await client.query('COMMIT');
                await res.sendStatus(201);
            } catch (error) {
                await client.query('ROLLBACK');
                await res.sendStatus(500);
                throw error;
            } finally {
                client.release();
            }
        })().catch((error) => {
            console.error(error.stack);
        });
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;