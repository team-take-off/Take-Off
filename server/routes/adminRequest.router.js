const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {
    if(req.isAuthenticated()){
        pool.query(`SELECT "time_off_request".*, "batch_of_requests"."date_requested", "batch_of_requests"."approved", "employee"."first_name", "type"."name"
                    FROM "employee" 
                    JOIN "batch_of_requests" ON "employee"."id" = "batch_of_requests"."employee_id"
                    JOIN "type" ON "type".id = "batch_of_requests"."type_id"
                    JOIN "time_off_request" ON "batch_of_requests"."id" = "time_off_request"."batch_of_requests_id"
                    ;`)
                    .then((result) => {
                        res.send(result.rows);
                    }).catch((error) => {
                        console.log('Error in GET route for admin router: ', error);
                        res.sendStatus(500);
                    });
    } else {
        res.sendStatus(403);
    }

});

router.get('/batch', (req, res) => {
    if(req.isAuthenticated()) {
        const queryText = `SELECT * FROM "batch_of_requests";`;
        pool.query(queryText).then(response => res.send(response.rows))
        .catch(error => {
            console.log('error in batch GET', error);
            res.sendStatus(500);
        });
    }else {
        res.sendStatus(403);
    }
    
});

router.post('/', (req, res) => {

});

module.exports = router;