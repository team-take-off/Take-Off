const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Route GET /api/admin/employees
// Allow the administrator to retrieve all employees in the database
router.get('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id == 1) {
        const queryText = `
        SELECT 
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "company_employee_id",
            "sick_hours",
            "vacation_hours",
            "role_id",
            "start_date",
            "is_active"
        FROM "employee";
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

// Route POST /api/admin/employees
// Allow the administrator to add a new employee to the database
router.post('/', (req, res) => {
    if (req.isAuthenticated() && req.user.role_id == 1) {
        const queryText = `
        INSERT INTO "employee"
            ("username", "password", "email", "first_name", "last_name", "company_employee_id", "start_date")
        VALUES
            ($1, $2, $3, $4, $5, $6, $7);
        `;
        const insertArray = [
            req.body.username, 
            '$2b$10$oy0t5N4snauzLT7NOWYknuD9AT1Xv2yGfACuBrhjufylt3nOBjERe', 
            req.body.username, 
            req.body.first_name, 
            req.body.last_name, 
            '00000', 
            req.body.start_date
        ];
        pool.query(queryText, insertArray).catch((error) => {
            console.log(`Error in POST /api/admin/employee, ${error}`);
            res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

router.put('/:id', (req, res) =>{
    if(req.isAuthenticated() && req.user.role_id == 1){
        const queryText = `UPDATE "employee" SET "is_active" = NOT "is_active" WHERE "id" = $1;`;
        pool.query(queryText, [req.params.id]).then(()=> {
            res.sendStatus(200);
        }).catch((error) => {
            res.sendStatus(500);
            console.log('error in update is_active: ', error);
        })
    } else {
        res.sendStatus(403);
    }
});

router.delete('/:id', (req, res) => {
     if (req.isAuthenticated() && req.user.role_id == 1) {

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