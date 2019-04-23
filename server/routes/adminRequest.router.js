const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment-holiday');
const moment1 = require('moment-business-days');

// Route GET /api/admin/request
// Returns an array all requested days off for all users
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        const queryText = `
        SELECT
            "time_off_request"."id",
            "time_off_request"."off_date" AS "date",
            "time_off_request"."off_hours" AS "hours",
            "time_off_request"."batch_of_requests_id",
            "batch_of_requests"."date_requested" AS "date_requested",
            "employee"."first_name",
            "employee"."last_name",
            "leave_type"."val" AS "type",
            "request_status"."val" AS "status"
        FROM "employee" 
        JOIN "batch_of_requests" ON "employee"."id" = "batch_of_requests"."employee_id"
        JOIN "leave_type" ON "leave_type"."id" = "batch_of_requests"."leave_type_id"
        JOIN "request_status" ON "request_status"."id" = "batch_of_requests"."request_status_id"
        JOIN "time_off_request" ON "batch_of_requests"."id" = "time_off_request"."batch_of_requests_id"
        ORDER BY "date_requested";
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
        SELECT
            "id",
            "date_requested" AS "date",
            "leave_type_id" AS "type"
        FROM "batch_of_requests";
        `;
        pool.query(queryText).then((result) => {
            res.send(result.rows)
        }).catch(queryError => {
            const errorMessage = `SQL error using GET /api/admin/request/batch, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        });
    } else {
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
	                    ("off_date", "batch_of_requests_id", "off_hours")
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
router.put('/approved/:id', (req, res) => {
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

// Route PUT /api/admin/request/edit
// Allows admins to edit a batch of requested days off
router.put('/edit', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const batchId = req.body.id;
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                // get information on current time off batch
                const oldTime = await client.query(`SELECT SUM("off_hours"), "leave_type_id", "leave_type"."val", "employee_id" FROM "time_off_request"
                JOIN "batch_of_requests" ON "time_off_request"."batch_of_requests_id" = "batch_of_requests"."id"
                JOIN "leave_type" ON "batch_of_requests"."leave_type_id" = "leave_type"."id"
                WHERE "batch_of_requests_id" = $1
                GROUP BY "leave_type_id", "val", "employee_id";`, [batchId]);
                // remove the current request
                await client.query(`DELETE from "time_off_request" 
                WHERE "batch_of_requests_id" = $1;`, [batchId]);
                const leaveType = oldTime.rows[0].val;
                const reimbursment = oldTime.rows[0].sum;
                const employeeToChange = oldTime.rows[0].employee_id;
                // reimburse the employee for the old leave hours
                const row = (leaveType === 'Vacation') ? '"vacation_hours"' : '"sick_hours"';
                await client.query(`UPDATE "employee" SET ${row} = ${row} + $1
                WHERE "id" = $2;`, [reimbursment, employeeToChange]);
                // replace with new batch of requests
                const requestedDates = req.body.newDates;
                if (requestedDates[0].date == requestedDates[requestedDates.length - 1].date &&
                    moment(requestedDates[0].date).isHoliday() == false && moment1(requestedDates[0].date).isBusinessDay() == true) {
                    const insertDateText = `
                    INSERT INTO "time_off_request"
	                    ("off_date", "batch_of_requests_id", "off_hours" )
                    VALUES
	                    ($1, $2, $3);
                    `;
                    await client.query(insertDateText, [requestedDates[0].date, batchId, requestedDates[0].hours]);
                    const updateEmployeeLeaveTable = `UPDATE "employee" SET 
                    ${leaveType === 1 ? "vacation_hours" : "sick_hours"} = ${leaveType === 1 ? "vacation_hours" : "sick_hours"} - ${requestedDates[0].hours}
                    WHERE "id" = $1;`
                    await client.query(updateEmployeeLeaveTable, [employeeToChange]);
                } else {
                    for (let request of requestedDates) {
                        if (moment(request.date).isHoliday() == false && moment1(request.date).isBusinessDay() == true) {
                            const insertDateText = `
                            INSERT INTO "time_off_request"
                                ("off_date", "batch_of_requests_id", "off_hours" )
                            VALUES
                                ($1, $2, $3);
                            `;
                            await client.query(insertDateText, [request.date, batchId, request.hours]);
                            const updateEmployeeLeaveTable = `UPDATE "employee" SET 
                            ${leaveType === 1 ? "vacation_hours" : "sick_hours"} = ${leaveType === 1 ? "vacation_hours" : "sick_hours"} - ${request.hours}
                            WHERE "id" = $1;`;
                            await client.query(updateEmployeeLeaveTable, [employeeToChange]);
                        }
                    }
                }
                res.sendStatus(200);
            } catch (error) {
                await client.query('ROLLBACK');
                await res.sendStatus(500);
                throw error;
            } finally {
                client.release();
            }
        })().catch(error => {
            console.error(error.stack);
        })
    } else {
        res.sendStatus(403);
    }
})

// Route DELETE /api/admin/request/:id
// Remove a batch of requested days off
// need way to remove approved pto leave, maybe use the route below
router.delete('/:id', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const batchID = req.params.id;
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                const getHoursText = `
                SELECT "employee_id", SUM("hours") AS "hours" FROM "time_off_request"
                WHERE "batch_of_requests_id" = $1;
                `;
                const getHoursResponse = await client.query(getHoursText, [batchID]);
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

                // need to give back time to employee
                console.log(`id: ${getHoursResponse.rows[0].employee_id}, hours: ${getHoursResponse.rows[0].hours}`);
                const insertHoursText = `
                UPDATE "employees" 
                `;


                await client.query('COMMIT');
                await res.sendStatus(200);
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