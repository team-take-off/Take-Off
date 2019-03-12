const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Route GET /api/employee/request
// Returns an array of requested days off for one user (based on user ID)
router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        const queryText = `
        SELECT
            "batch_of_requests".*, "time_off_request".* 
            FROM "employee" 
            JOIN "batch_of_requests" ON "employee"."id" = "batch_of_requests"."employee_id"
            JOIN "time_off_request" ON "batch_of_requests"."id" = "time_off_request"."batch_of_requests_id"
            WHERE "employee"."id" = $1;
        `;
        pool.query(queryText, [req.user.id]).then((queryResponse) => {
            res.send(queryResponse.rows);
        }).catch((queryError) => {
            const errorMessage = `SQL error using GET /api/employee/request, ${queryError}`;
            console.log(errorMessage);
            res.sendStatus(500);
        });
    }
});

router.post('/', (req, res) => {

});

module.exports = router;