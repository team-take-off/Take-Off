const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment-holiday');
const moment1 = require('moment-business-days');

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

// Route POST /api/request
// User adds requested time-off to the database
router.post('/', rejectUnauthenticated, (req, res) => {
    const userID = req.user.id;
    const typeID = req.body.typeID;
    const requestedDates = req.body.requestedDates;

    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const insertComparisonText = `
            INSERT INTO batch_of_requests
                (employee_id, leave_type_id)
            VALUES
                ($1, $2)
            RETURNING id;
            `;
            const { rows } = await client.query(insertComparisonText, [userID, typeID]);
            const batchID = rows[0].id;
            if (requestedDates[0].date == requestedDates[requestedDates.length - 1].date &&
                moment(requestedDates[0].date).isHoliday() == false && moment1(requestedDates[0].date).isBusinessDay() == true) {
                const insertDateText = `
                INSERT INTO time_off_request
                    (off_date, batch_of_requests_id, off_hours)
                VALUES
                    ($1, $2, $3);
                `;
                await client.query(insertDateText, [requestedDates[0].date, batchID, requestedDates[0].hours]);
                const updateEmployeeLeaveTable = `
                UPDATE employee SET 
                    ${typeID === 1 ? 'vacation_hours' : 'sick_hours'} = ${typeID === 1 ? 'vacation_hours' : 'sick_hours'} - ${requestedDates[0].hours}
                WHERE id = $1`
                await client.query(updateEmployeeLeaveTable, [userID]);
            } else {
                for (let request of requestedDates) {
                    if (moment(request.date).isHoliday() == false && moment1(request.date).isBusinessDay() == true) {
                        const insertDateText = `
                        INSERT INTO time_off_request
                            (off_date, batch_of_requests_id, off_hours)
                        VALUES
                            ($1, $2, $3);
                        `;
                        await client.query(insertDateText, [request.date, batchID, request.hours]);
                        const updateEmployeeLeaveTable = `
                        UPDATE employee SET 
                        ${typeID === 1 ? 'vacation_hours' : 'sick_hours'} = ${typeID === 1 ? 'vacation_hours' : 'sick_hours'} - ${request.hours}
                        WHERE id = $1`
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
        console.log('SQL error using route POST /api/request');
    });
});

module.exports = router;