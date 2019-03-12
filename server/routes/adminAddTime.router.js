const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {

});

router.post('/:id', (req, res) => {
    
    if (req.isAuthenticated()) {
        console.log('req paramas', req.params);
    console.log('req user', req.user);
    console.log('req body', req.body);
        // const queryText = `
        //     INSERT INTO "accrued_time" 
        //         ("year", ${req.body.id == 1 ? "sick_time" : "vacation_time"}, "employee_id")
        //     VALUES (')`
            
        // pool.query(queryText, [req.params.id])
        // .then(response =>{res.sendStatus(200)})
        // .catch(error => {
        //     console.log('error in PUT', error);
        //     res.sendStatus(500);
        // })
    }else {
        res.sendStatus(403);
    }
});

module.exports = router;