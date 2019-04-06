const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Route GET /api/admin/employees
// Allow the administrator to retrieve all employees in the database
router.get('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const queryText = `
        SELECT 
            "id",
            "email",
            "first_name",
            "last_name",
            "sick_hours",
            "vacation_hours",
            "role_id",
            "started_date" AS "start_date",
            "is_active"
        FROM "employee"
        ORDER BY "last_name", "first_name";
        `;
        pool.query(queryText).then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log('Error in GET route: ', error);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

// Route POST /api/admin/employee
// Allow the administrator to add a new employee to the database
router.post('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const queryText = `
        INSERT INTO "employee"
            ("email", "first_name", "last_name", "started_date")
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
            res.sendStatus(200);
        }).catch((error) => {
            console.log(`Error in POST /api/admin/employee, ${error}`);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

// Route PUT /api/admin/employee
// Allow the administrator to update employee account data
router.put('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id === 1) {
        const employee = req.body;
        const queryText = `
        UPDATE "employee" 
        SET 
            "first_name" = $1,
            "last_name" = $2,
            "email" = $3,
            "started_date" = $4,
            "vacation_hours" = $5,
            "sick_hours" = $6
        WHERE 
            "id" = $7;`;
        queryArray = [employee.first_name, employee.last_name, employee.email, employee.start_date, employee.vacation_hours, employee.sick_hours, employee.id];
        pool.query(queryText, queryArray).then((response) => {
            res.sendStatus(200);
        }).catch((error) => {
            res.sendStatus(500);
            console.log(`Error in PUT /api/admin/employee, ${error}`);
        })
    } else {
        res.sendStatus(403);
    }
});

// Route PUT /api/admin/employee/active/:id
// Allow the administrator to update active status of a single employee
router.put('/active/:id', (req, res) =>{
    if(req.isAuthenticated() && req.user.role_id === 1) {
        const is_active = req.body.is_active;
        const queryText = `UPDATE "employee" SET "is_active" = $1 WHERE "id" = $2;`;
        pool.query(queryText, [is_active, req.params.id]).then(()=> {
            res.sendStatus(200);
        }).catch((error) => {
            res.sendStatus(500);
            console.log(`Error in PUT /api/admin/employee/active/:id, ${error}`);
        })
    } else {
        res.sendStatus(403);
    }
});

router.delete('/:id', (req, res) => {
     if (req.isAuthenticated() && req.user.role_id === 1) {

    console.log('req.params: ', req.params);
    const queryText = `DELETE FROM "employee" WHERE "id" = $1;`;
    pool.query(queryText, [req.params.id]).then(() => {
        res.sendStatus(200);
    }).catch((error) => {
        console.log('Error in Delete adminEmployee: ', error);
        res.sendStatus(500);
    })

}

});

module.exports = router;