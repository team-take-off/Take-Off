const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


// router.get('/', (req, res) => {
//     if(req.isAuthenticated()){
//         pool.query(`SELECT "employee"."first_name" AS "First Name", 
//                     "employee"."last_name" AS "Last Name", "employee"."company_employee_id" AS "ID", 
//                     "employee"."start_date" AS "Employee Start Date", 
//                     "employee"."email" AS "Employee Email",
//                     "employee"."is_active" AS "Time Off Approved Status"
//                     FROM "employee" WHERE "id" = $1;`, [req.user.id])
//                     .then((result)=> {
//                         res.send(result.rows);
//                     }).catch((error) => {
//                         console.log('Error in GET route for user: ', error);
//                         res.sendStatus(500);
//                     });
//     } else {
//         res.sendStatus(403);
//     }

// });

router.post('/', (req, res) => {

});

module.exports = router;