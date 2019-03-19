const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment-holiday');
const moment1 = require('moment-business-days');
// Route GET /api/employee/request
// Returns an array of requested days off for one user (based on user ID)
router.get('/', (req, res) => {
    if (req.isAuthenticated() && req.user.is_active) {
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
        WHERE "employee"."id" = $1
        ORDER BY "date_requested";
        `;

        pool.query(queryText, [req.user.id]).then((queryResponse) => {
            res.send(queryResponse.rows);
        }).catch((queryError) => {
            const errorMessage = `SQL error using GET /api/employee/request, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

// Route POST /api/employee/request
// User adds requested time-off to the database
router.post('/', (req, res) => {
    if (req.isAuthenticated() && req.user.is_active) {
        const userID = req.user.id;
        const typeID = req.body.typeID;
        const requestedDates = req.body.requestedDates;
        
        (async () => {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                const insertComparisonText = `
                INSERT INTO "batch_of_requests"
                    ("employee_id", "leave_type_id")
                VALUES
                    ($1, $2)
                RETURNING id;
                `;
                const { rows } = await client.query(insertComparisonText, [userID, typeID]);
                const batchID = rows[0].id;
                if (requestedDates[0].date == requestedDates[requestedDates.length - 1].date&&
                    moment(requestedDates[0].date).isHoliday() == false && moment1(requestedDates[0].date).isBusinessDay() == true){
                    const insertDateText = `
                    INSERT INTO "time_off_request"
	                    ("off_date", "batch_of_requests_id", "off_hours" )
                    VALUES
	                    ($1, $2, $3);
                    `;
                    await client.query(insertDateText, [requestedDates[0].date, batchID, requestedDates[0].hours]);
                    const updateEmployeeLeaveTable = `UPDATE "employee" SET 
                    ${typeID === 1 ? "vacation_hours" : "sick_hours"} = ${typeID === 1 ? "vacation_hours" : "sick_hours"} - ${requestedDates[0].hours}
                    WHERE "id" = $1`
                    await client.query(updateEmployeeLeaveTable, [userID]);
                }else{
                for (let request of requestedDates) {
                    if (moment(request.date).isHoliday() == false && moment1(request.date).isBusinessDay() == true){
                    const insertDateText = `
                    INSERT INTO "time_off_request"
	                    ("off_date", "batch_of_requests_id", "off_hours" )
                    VALUES
	                    ($1, $2, $3);
                    `;
                    await client.query(insertDateText, [request.date, batchID, request.hours]);
                    const updateEmployeeLeaveTable = `UPDATE "employee" SET 
                    ${typeID === 1 ? "vacation_hours" : "sick_hours"} = ${typeID === 1 ? "vacation_hours" : "sick_hours"} - ${request.hours}
                    WHERE "id" = $1`
                    await client.query(updateEmployeeLeaveTable, [userID]);
                    }
                }
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

// Route DELETE /api/employee/request/:id
// Removes a batch of requested days off belonging to one user (based on batch ID)
router.delete('/:id', async (req, res) => {
    if (req.isAuthenticated () && req.user.is_active) {
        const employeeID = req.user.id;
        const batchID = req.params.id;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const hoursToGiveBack = `
            SELECT SUM("off_hours") FROM "time_off_request" WHERE "batch_of_requests_id" = $1;`
            let results = await client.query(hoursToGiveBack, [batchID]);
            const typeOfLeave = `
            SELECT "leave_type_id" FROM "batch_of_requests" WHERE id = $1;`;
            let type= await client.query(typeOfLeave, [batchID]);
            if(type===1){
                let giveBackHoursText = `
                UPDATE "employee" SET "vacation_hours" = "vacation_hours" + $1
                WHERE "id" = $2`
                await client.query(giveBackHoursText,[results, employeeID])
            }else{
                giveBackHoursText = `
                UPDATE "employee" SET "sick_hours" = "sick_hours" + $1
                WHERE "id" = $2`
                await client.query(giveBackHoursText, [results.rows[0], employeeID])
            }

            const deleteRequestsText = `
            DELETE FROM "time_off_request" 
            WHERE "batch_of_requests_id" = $1;
            `;
            await client.query(deleteRequestsText, [batchID]);
            const deleteBatchText = `
            DELETE FROM "batch_of_requests" 
            WHERE id = $1 AND "employee_id" = $2
            RETURNING *;
            `;
            const { rowCount } = await client.query(deleteBatchText, [batchID, employeeID]);
            if (rowCount === 0) {
                throw new Error('Attempted to delete an entry from table "batch_of_requests" that does not belong to the currently authenticated user.');
            }
            await client.query('COMMIT');
            res.sendStatus(200);
        } catch (queryError) {
            await client.query('ROLLBACK');
            const errorMessage = `SQL error using DELETE /api/employee/request/:id, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    } else {
        res.sendStatus(403);
    }
});

module.exports = router;
