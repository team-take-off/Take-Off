const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment-holiday');
const moment1 = require('moment-business-days');

const ADMINISTRATOR_ROLE = 1;
const VACATION_TYPE = 1;
const SICK_TYPE = 2;
const PENDING_STATUS = 1;

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

// Route PUT /api/request/:id
// Update the value of approved for a batch of requested days off
router.put('/:id', rejectNonAdmin, (req, res) => {
    const batchID = req.params.id;
    const requestStatus = req.body.requestStatus;
    const queryText = `
    UPDATE batch_of_requests
        SET request_status_id = $1
        WHERE id = $2;
    `;
    pool.query(queryText, [requestStatus, batchID]).then((queryResult) => {
        res.sendStatus(200);
    }).catch((queryError) => {
        console.log('SQL error using PUT /api/request/:id,', queryError);
        res.sendStatus(500);
    });
});

// Route DELETE /api/request/:id
// Removes a batch of requested days off belonging to one user (based on batch ID)
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const batchID = req.params.id;

    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            let employeeID = req.user.id;
            const typeOfLeave = `
            SELECT 
                employee_id, 
                request_status_id, 
                leave_type_id
            FROM batch_of_requests 
            WHERE id = $1;
            `;
            const batch = await client.query(typeOfLeave, [batchID]);
            const selectID = batch.rows[0].employee_id;
            const requestStatusID = batch.rows[0].request_status_id;
            const leaveTypeID = batch.rows[0].leave_type_id;
            if (req.user.role_id === ADMINISTRATOR_ROLE) {
                employeeID = selectID;
            } else if (employeeID !== selectID) {
                throw new Error('Attempted unautharized query on route DELETE /api/request/:id.');
            }

            if (requestStatusID === PENDING_STATUS) {
                // TODO: This should include a check to see if the deleted request is in the future and 
                // Prevent non-admin users from deleting in that case.
                const selectRefundHoursText = `
                SELECT 
                    SUM(off_hours) 
                    FROM time_off_request 
                    WHERE batch_of_requests_id = $1;
                `;
                const selectRefundHours = await client.query(selectRefundHoursText, [batchID]);
                const refundHours = selectRefundHours.rows[0].sum;
                if (leaveTypeID === VACATION_TYPE) {
                    const updateRefundText = `
                    UPDATE employee
                        SET vacation_hours = vacation_hours + $1
                        WHERE id = $2
                    `;
                    await client.query(updateRefundText, [refundHours, employeeID])
                } else if (leaveTypeID === SICK_TYPE) {
                    const updateRefundText = `
                    UPDATE employee
                        SET sick_hours = sick_hours + $1
                        WHERE id = $2
                    `;
                    await client.query(updateRefundText, [refundHours, employeeID])
                }
            }

            const deleteRequestsText = `
            DELETE 
                FROM time_off_request
                WHERE batch_of_requests_id = $1;
            `;
            await client.query(deleteRequestsText, [batchID]);
            const deleteBatchText = `
            DELETE 
                FROM batch_of_requests
                WHERE id = $1 AND employee_id = $2
                RETURNING *;
            `;
            await client.query(deleteBatchText, [batchID, employeeID]);
            await client.query('COMMIT');
            res.sendStatus(200);
        } catch (queryError) {
            await client.query('ROLLBACK');
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