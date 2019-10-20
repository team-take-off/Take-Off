const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectNonAdmin } = require('../modules/authentication-middleware');

const parseInteger = (input) => {
    const parsed = parseInt(input);
    if (isNaN(parsed)) {
        return null;
    }
    return parsed;
}

// Route GET /api/employee
// Allow the administrator to retrieve all employees in the database
router.get('/', rejectNonAdmin, (req, res) => {
    const queryText = `
    SELECT 
        id,
        email,
        first_name,
        last_name,
        sick_hours,
        vacation_hours,
        role_id,
        started_date AS start_date,
        is_active
    FROM employee
    ORDER BY last_name, first_name;
    `;
    pool.query(queryText).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log('Error in route GET /api/employee,', error);
        res.sendStatus(500);
    });
});

// Route POST /api/employee
// Allow the administrator to add a new employee to the database
router.post('/', rejectNonAdmin, (req, res) => {
    const queryText = `
    INSERT INTO employee
        (email, first_name, last_name, started_date)
    VALUES
        ($1, $2, $3, $4);
    `;
    const insertArray = [
        req.body.email, 
        req.body.first_name, 
        req.body.last_name,
        req.body.start_date
    ];
    pool.query(queryText, insertArray).then((response) => {
        res.sendStatus(201);
    }).catch((error) => {
        console.log('Error in route POST /api/employee,', error);
        res.sendStatus(500);
    });
});

// Route PUT /api/employee
// Allow the administrator to update employee account data
router.put('/', rejectNonAdmin, (req, res) => {
    const employee = req.body;
    const queryText = `
    UPDATE employee
    SET 
        first_name = $1,
        last_name = $2,
        email = $3,
        started_date = $4,
        vacation_hours = $5,
        sick_hours = $6
    WHERE 
        id = $7;
    `;
    queryArray = [employee.first_name, employee.last_name, employee.email, employee.start_date, employee.vacation_hours, employee.sick_hours, employee.id];
    pool.query(queryText, queryArray).then((response) => {
        res.sendStatus(200);
    }).catch((error) => {
        res.sendStatus(500);
        console.log('Error in route PUT /api/employee,', error);
    });
});

// Route PUT /api/employee/active/:id
// Allow the administrator to update active status of a single employee
router.put('/active/:id', rejectNonAdmin, (req, res) =>{
    const is_active = req.body.is_active;
    const queryText = `
    UPDATE employee 
        SET is_active = $1 
        WHERE id = $2;
    `;
    pool.query(queryText, [is_active, req.params.id]).then(()=> {
        res.sendStatus(200);
    }).catch((error) => {
        res.sendStatus(500);
        console.log('Error in route PUT /api/employee/active/:id,', error);
    });
});

// Route PUT /api/employee/accrued-time/:id
// Allow the administrator to add off-time to an employee's account
router.put('/accrued-time/:id', rejectNonAdmin, (req, res) => {
    const user = new User(req.user);
    const author = user.id;
    const employee = parseInteger(req.params.id);
    const type =  parseInteger(req.body.leaveType);
    const hours = parseInteger(req.body.hours);

    const typeHoursName = RequestType.columnName(type);

    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const updateEmployeeSQL = `
            UPDATE employee
                SET ${typeHoursName} = ${typeHoursName} + $1
                WHERE id = $2;
            `;
            await client.query(updateEmployeeSQL, [hours, employee]);
            // const insertLogSQL = `
            // INSERT INTO transaction_log 
            //     (author_id, employee_id, leave_hours, leave_type_id, transaction_type_id)
            //     VALUES 
            //     ($1, $2, $3, $4, (SELECT id FROM transaction_type WHERE val = 'admin special'));
            // `;
            // await client.query(insertLogSQL, [author, employee, hours, type]);
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
        console.log('SQL error using PUT /api/employee/accrued-time/:id');
    });
});

module.exports = router;