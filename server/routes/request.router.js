const express = require('express');
const { rejectUnauthenticated, rejectNonAdmin } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();
const moment = require('moment');

const ADMINISTRATOR_ROLE = 1;
const VACATION_TYPE = 1;
const SICK_TYPE = 2;
const PENDING_STATUS = 1;
const DENIED_STATUS = 3;

const SUNDAY = '0';
const SATURDAY = '6';

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
            const batchID = await insertBatch(client, userID, typeID);
            for (let request of requestedDates) {
                await insertRequest(client, request, userID, batchID, typeID);
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
    const id = req.params.id;
    const requestStatus = req.body.requestStatus;

    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const batch = await getBatchData(client, id);
            await updateBatchStatus(client, id, requestStatus);
            if (requestStatus === DENIED_STATUS && requestStatus !== batch.status) {
                await refundBatchHours(client, batch);
            }
            await client.query('COMMIT');
            res.sendStatus(200);
        } catch (error) {
            await client.query('ROLLBACK');
            await res.sendStatus(500);
            throw error;
        } finally {
            client.release();
        }
    })().catch((error) => {
        console.error(error.stack);
        console.log('SQL error using PUT /api/request/:id');
    });
    
});

// Route DELETE /api/request/:id
// Removes a batch of requested days off belonging to one user (based on batch ID)
router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const id = req.params.id;

    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            let employeeID = req.user.id;
            const batch = await getBatchData(client, id);
            if (req.user.role_id === ADMINISTRATOR_ROLE) {
                employeeID = batch.employee;
            } else if (employeeID !== batch.employee) {
                throw new Error('Attempted unautharized query on route DELETE /api/request/:id.');
            }

            if (batch.status === PENDING_STATUS) {
                // TODO: This should include a check to see if the deleted request is in the future and 
                // Prevent non-admin users from deleting in that case.
                await refundBatchHours(client, batch);
            }

            await deleteBatch(client, batch);
            await client.query('COMMIT');
            res.sendStatus(200);
        } catch (error) {
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

// Insert a new batch of requests and return the assigned id (i.e. the primary key)
const insertBatch = async (client, userID, typeID) => {
    const insertText = `
        INSERT INTO batch_of_requests
            (employee_id, leave_type_id)
        VALUES
            ($1, $2)
        RETURNING id;
    `;
    const { rows } = await client.query(insertText, [userID, typeID]);
    const batchID = rows[0].id;
    return batchID;
};

// Insert a new request for time-off. Then update the employee's total hours 
// available.
const insertRequest = async (client, request, userID, batchID, typeID) => {
    let hours;
    if (typeID === VACATION_TYPE) {
        hours = 'vacation_hours';
    } else if (typeID === SICK_TYPE) {
        hours = 'sick_hours';
    } else {
        throw Error(`Error in request.router.js function insertRequest. Invalid typeID (${typeID}) must be 1 or 2.`);
    }

    const date = moment(request.date, 'YYYY-MM-DD');
    const day = date.format('d');
    if (day !== SUNDAY && day !== SATURDAY) {
        const insertRequest = `
            INSERT INTO time_off_request
                (off_date, batch_of_requests_id, off_hours)
            VALUES
                ($1, $2, $3);
        `;
        await client.query(insertRequest, [request.date, batchID, request.hours]);
        const updateHours = `
            UPDATE employee SET 
                ${hours} = ${hours} - $1
                WHERE id = $2;
        `;
        await client.query(updateHours, [request.hours, userID]);
    }
};

// Returns a batch of requests object based on batch id
const getBatchData = async (client, id) => {
    const selectText = `
        SELECT 
            id,
            employee_id, 
            request_status_id, 
            leave_type_id
        FROM batch_of_requests 
        WHERE id = $1;
    `;
    const { rows } = await client.query(selectText, [id]);
    return {
        id: rows[0].id,
        employee: rows[0].employee_id,
        status: rows[0].request_status_id,
        type: rows[0].leave_type_id
    };
};

// Changes the status (PENDING, APPROVED, DENIED) of a batch of requests
const updateBatchStatus = async (client, id, status) => {
    const updateText = `
        UPDATE batch_of_requests
            SET request_status_id = $1
            WHERE id = $2;
    `;
    await client.query(updateText, [status, id]);
};

// Refund the total number of off-hours found in a batch of requests
const refundBatchHours = async (client, batch) => {
    let hours;
    if (batch.type === VACATION_TYPE) {
        hours = 'vacation_hours';
    } else if (batch.type === SICK_TYPE) {
        hours = 'sick_hours';
    } else {
        throw Error(`Error in request.router.js function refundBatchHours. Invalid batch.type (${batch.type}).`);
    }

    const sumHoursText = `
        SELECT 
            SUM(off_hours)
            FROM time_off_request
            WHERE batch_of_requests_id = $1;
    `;
    const { rows } = await client.query(sumHoursText, [batch.id]);
    const refundHours = rows[0].sum;

    const updateEmployeeText = `
        UPDATE employee
            SET ${hours} = ${hours} + $1
            WHERE id = $2
    `;
    await client.query(updateEmployeeText, [refundHours, batch.employee]);
};

// Deletes a batch of time-off requests
const deleteBatch = async (client, batch) => {
    const deleteRequestsText = `
        DELETE 
            FROM time_off_request
            WHERE batch_of_requests_id = $1;
    `;
    await client.query(deleteRequestsText, [batch.id]);
    const deleteBatchText = `
        DELETE 
            FROM batch_of_requests
            WHERE id = $1;
    `;
    await client.query(deleteBatchText, [batch.id]);
}

module.exports = router;