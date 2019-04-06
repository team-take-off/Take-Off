const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// Route GET /api/request
// Returns an array all requested days off for all users
router.get('/', rejectUnauthenticated, (req, res) => {
    const queryText = `
    SELECT
        time_off_request.id,
        time_off_request.off_date AS date,
        time_off_request.off_hours AS hours,
        time_off_request.batch_of_requests_id,
        batch_of_requests.date_requested AS date_requested,
        employee.first_name,
        employee.last_name,
        leave_type.val AS type,
        request_status.val AS status
    FROM employee 
    JOIN batch_of_requests ON employee.id = batch_of_requests.employee_id
    JOIN leave_type ON leave_type.id = batch_of_requests.leave_type_id
    JOIN request_status ON request_status.id = batch_of_requests.request_status_id
    JOIN time_off_request ON batch_of_requests.id = time_off_request.batch_of_requests_id
    ORDER BY date_requested;
    `;
    pool.query(queryText).then((result) => {
        res.send(result.rows);
    }).catch((queryError) => {
        console.log('SQL error using route GET /api/request,', queryError);
        res.sendStatus(500);
    });
});

// Route GET /api/request/current-user
// Returns an array all requested days off for the currently authenticated user
router.get('/current-user', rejectUnauthenticated, (req, res) => {
    const queryText = `
    SELECT
        time_off_request.id,
        time_off_request.off_date AS date,
        time_off_request.off_hours AS hours,
        time_off_request.batch_of_requests_id,
        batch_of_requests.date_requested AS date_requested,
        employee.first_name,
        employee.last_name,
        leave_type.val AS type,
        request_status.val AS status
    FROM employee 
    JOIN batch_of_requests ON employee.id = batch_of_requests.employee_id
    JOIN leave_type ON leave_type.id = batch_of_requests.leave_type_id
    JOIN request_status ON request_status.id = batch_of_requests.request_status_id
    JOIN time_off_request ON batch_of_requests.id = time_off_request.batch_of_requests_id
    WHERE employee.id = $1
    ORDER BY date_requested;
    `;
    pool.query(queryText, [req.user.id]).then((result) => {
        res.send(result.rows);
    }).catch((queryError) => {
        console.log('SQL error using route GET /api/request/current-user,', queryError);
        res.sendStatus(500);
    });
});

module.exports = router;