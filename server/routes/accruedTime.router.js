const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectNonAdmin } = require('../modules/authentication-middleware');

router.put('/:id', rejectNonAdmin, (req,res) => {
    const author_id = req.user.id;
    const employee_id = req.body.id;
    const leaveType = req.body.leaveType;
    const leave_hours = req.body.hours;

    let hours = '';
    let leave_type_id;
    if (leaveType === 'vacation') {
        hours = 'vacation_hours';
        leave_type_id = 1;
    } else if (leaveType === 'sick') {
        hours = 'sick_hours';
        leave_type_id = 2;
    } else {
        console.log(`Unknown leave type: ${leaveType}`);
        res.sendStatus(500);
    }

    (async () => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const updateEmployeeSQL = `
            UPDATE employee
                SET ${hours} = ${hours} + $1
                WHERE id = $2;
            `;
            await client.query(updateEmployeeSQL, [leave_hours, employee_id]);
            const insertLogSQL = `
            INSERT INTO transaction_log 
                (author_id, employee_id, leave_hours, leave_type_id, transaction_type_id)
                VALUES 
                ($1, $2, $3, $4, (SELECT id FROM transaction_type WHERE val = 'admin special'));
            `;
            await client.query(insertLogSQL, [author_id, employee_id, leave_hours, leave_type_id]);
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
        console.log('SQL error using PUT /api/accrued-time');
    });

});

module.exports = router;