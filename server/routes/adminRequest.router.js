const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        pool.query(`SELECT "time_off_request".*, "batch_of_requests"."date_requested", "batch_of_requests"."approved", "employee"."first_name", "type"."name"
                    FROM "employee" 
                    JOIN "batch_of_requests" ON "employee"."id" = "batch_of_requests"."employee_id"
                    JOIN "type" ON "type".id = "batch_of_requests"."type_id"
                    JOIN "time_off_request" ON "batch_of_requests"."id" = "time_off_request"."batch_of_requests_id"
                    ;`)
                    .then((result) => {
                        res.send(result.rows);
                    }).catch((error) => {
                        console.log('Error in GET route for admin router: ', error);
                        res.sendStatus(500);
                    });
    } else {
        res.sendStatus(403);
    }

});

router.get('/batch', (req, res) => {
    if(req.isAuthenticated()) {
        const queryText = `SELECT * FROM "batch_of_requests";`;
        pool.query(queryText).then(response => res.send(response.rows))
        .catch(error => {
            console.log('error in batch GET', error);
            res.sendStatus(500);
        });
    }else {
        res.sendStatus(403);
    }
    
});

router.post('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id == 1) {
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

module.exports = router;