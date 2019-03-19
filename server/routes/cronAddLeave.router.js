const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const cron = require('node-cron');
let task;

testCronTask = () => {
    
    task = cron.schedule("*/7 * * * * *", () => {
        console.log('runs this task every 7 seconds');
        // if (task) {
        //     task.stop();
        // }
        // add queries below
    })
}

router.post('/', (req, res) => {
    testCronTask();
})

module.exports = router;