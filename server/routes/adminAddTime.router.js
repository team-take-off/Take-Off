const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {

});

router.post('/:id', (req, res) => {
    
    if (req.isAuthenticated()) {
        const queryText = `
            INSERT INTO "accrued_time" 
                ("sick_time", "vacation_time", "employee_id")
            VALUES ($1, $2, $3)`
            
        pool.query(queryText, [,,,])
        .then(response =>{res.sendStatus(200)})
        .catch(error => {
            console.log('error in PUT', error);
            res.sendStatus(500);
        })
    }else {
        res.sendStatus(403);
    }
});

router.put('/:id', (req, res) => {
    if(req.isAuthenticated()) {
        const queryText = `UPDATE "employee" SET "vacation_hours" = "vacation_hours" + 8 WHERE "id" = $1;`;
        pool.query(queryText, [req.params.id])
    }
})

module.exports = router;