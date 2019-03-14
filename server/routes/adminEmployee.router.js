const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


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

router.post('/', (req, res) => {

});

module.exports = router;