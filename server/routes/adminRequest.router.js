const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Route DELETE /api/admin/request/:id
// Remove a batch of requested days off
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