const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment-holiday');
const moment1 = require('moment-business-days');


// Route DELETE /api/employee/request/:id
// Removes a batch of requested days off belonging to one user (based on batch ID)
router.delete('/:id', async (req, res) => {
    if (req.isAuthenticated () && req.user.is_active) {
        const batchID = req.params.id;
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            let employeeID;
            if(req.user.role === 2){
                employeeID = req.user.id;
            }else{
                const typeOfLeave = `
            SELECT "employee_id" FROM "batch_of_requests" WHERE id = $1;`;
                let person = await client.query(typeOfLeave, [batchID]);
                employeeID = person.rows[0].employee_id;
            }
            const hoursToGiveBack = `
            SELECT SUM("off_hours") FROM "time_off_request" WHERE "batch_of_requests_id" = $1;`
            let results = await client.query(hoursToGiveBack, [batchID]);
            const typeOfLeave = `
            SELECT "leave_type_id" FROM "batch_of_requests" WHERE id = $1;`;
            let type= await client.query(typeOfLeave, [batchID]);
            if(type.rows[0].leave_type_id == 1){
                let giveBackHoursText = `
                UPDATE "employee" SET "vacation_hours" = "vacation_hours" + $1
                WHERE "id" = $2`
                await client.query(giveBackHoursText,[results.rows[0].sum, employeeID])
            }else{
                giveBackHoursText = `
                UPDATE "employee" SET "sick_hours" = "sick_hours" + $1
                WHERE "id" = $2`
                await client.query(giveBackHoursText, [results.rows[0].sum, employeeID])
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
