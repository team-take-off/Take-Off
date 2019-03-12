const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {

});

router.put('/:id', (req, res) => {
    // if (req.isAuthenticated()) {
        const queryText = `
            UPDATE "accrued_time" SET "sick_time" = "sick_time" + 1 
            WHERE EXTRACT(YEAR FROM "year") = EXTRACT(YEAR FROM NOW()) 
            AND "employee_id" = $1;`;
        pool.query(queryText, [req.params.id])
        .then(response =>{res.sendStatus(200)})
        .catch(error => {
            console.log('error in PUT', error);
            res.sendStatus(500);
        })
    // }else {
    //     res.sendStatus(403);
    // }
});

module.exports = router;