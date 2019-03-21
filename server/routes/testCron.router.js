const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.post('/', (req, res) => {
    if (req.isAuthenticated()) {
        let requestedInfo = req.body
        console.log('requestedInfo', requestedInfo);
       res.sendStatus(200);

    } else {
        res.sendStatus(403);
    }
}); // END OF POST


module.exports = router;