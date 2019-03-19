const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const cron = require('node-cron');
let task;
let currentTime;

testCronTask = () => {
    console.log('hghg');
    
    task = cron.schedule("*/30 * * * *", () => {
        // if (task) {
        //     task.stop();
        // }
        // add queries below
        console.log('Runs every 30 minutes');
        const queryText = `UPDATE "employee" 
                        SET "vacation_hours" = "vacation_hours" + 8;`
        pool.query(queryText).then(response => console.log(response.rows));
    })
}

testCronTask();
module.exports = router;