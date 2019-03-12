const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.get('/', (req, res) => {

});

router.put('/', (req, res) => {
    if (req.isAuthenticated()) {
        const queryText = `
            UPDATE "accrued_time" SET "sick_time" = "sick_time" + 1 
            WHERE EXTRACT(YEAR FROM "year") = EXTRACT(YEAR FROM NOW()) 
            AND "id" = $1;`;
    }else {
        res.sendStatus(403);
    }
});

module.exports = router;