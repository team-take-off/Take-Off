const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/:id', (req, res) => {    
    if (req.isAuthenticated() && req.user.role_id == 1) {
        let queryText;
        switch (true) {
            case (req.body.leaveType === 'vacation'):
                queryText = `
                INSERT INTO "accrued_time" 
                    ("sick_hours", "vacation_hours", "employee_id")
                VALUES (0, 8, $1)`
                
                pool.query(queryText, [req.params.id])
                .then(() => res.sendStatus(200))
                .catch(error => {
                    console.log('error in POST', error);
                    res.sendStatus(500);
                })
                break;
            case (req.body.leaveType === 'sick'):
                queryText = `
                    INSERT INTO "accrued_time" 
                        ("sick_hours", "vacation_hours", "employee_id")
                    VALUES (8, 0, $1)`
                    
                pool.query(queryText, [req.params.id])
                .then(() => res.sendStatus(200))
                .catch(error => {
                    console.log('error in POST', error);
                    res.sendStatus(500);
                })
            default:
                break;
        }
        
    }else {
        res.sendStatus(403);
    }
}); // END OF POST

router.put('/:id', (req,res) => {
    if (req.isAuthenticated()) {
        let queryText;
        switch (true) {
            case (req.body.leaveType === 'vacation'):
                queryText = `UPDATE "employee" SET "vacation_hours" = "vacation_hours" + 8 WHERE "id" = $1;`;
                pool.query(queryText, [req.params.id]).then(() => res.sendStatus(200))
                .catch(error => {
                    console.log('error in making vacation UPDATE', error);
                    res.sendStatus(500);
                });
                break;
            case (req.body.leaveType === 'sick'):
                queryText = `UPDATE "employee" SET "sick_hours" = "sick_hours" + 8 WHERE "id" = $1;`;
                pool.query(queryText, [req.params.id]).then(() => res.sendStatus(200))
                .catch(error => {
                    console.log('error in making sick UPDATE', error);
                    res.sendStatus(500);
        });
                break;
            default:
                break;
        }
    } else {
        res.sendStatus(403);
    }
}) // END OF PUT

module.exports = router;