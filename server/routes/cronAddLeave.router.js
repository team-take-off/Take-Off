const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const cron = require('node-cron');
let task;

// next steps go here

// Vacation Rules
// PTO = vacation
// Paid Time of For Vacation and Other Uses

// -Employees can carry over a maxiumum of 5 days of PTO.
// - January 1, employees get half of their PTO for the year.
// - June 1, employees get the second half of their PTO for the year.
// - if employee is hired between october 1 and december 31, they wont get
//     PTO until january 1.
// - if employee is hired between january 2 and september 30, they will
//     get 15 PTO days.

// - 1st year employees earn a total of 15 PTO days.
// - 2nd year employees earn a total of 18 PTO days.
// - 3rd-10th year employees earn a total of 20 PTO days.
// - 11th-13th year employees earn a total of 22 PTO days.
// - 14th-∞ year employees earn a total of 25 PTO days.

// Runs every January 1 of every year
function runJanuaryFirst() {
    task = cron.schedule("0 0 1 1 *", () => {
                if (task) {
                    task.stop();
                }
                const queryText = `SELECT * FROM "employee"`;
                pool.query(queryText).then(response => {
                    response.rows.map(person => {
                        // will grab all of employees vacation hours
                        console.log('employee vacation', person.vacation_hours);
                        let allowedCarryOverHours = 5
                        if (person.vacation_hours > allowedCarryOverHours ) {
                            while (person.vacation_hours > allowedCarryOverHours ) {
                            person.vacation_hours -= 1 
                            }
                            
                        }
                        console.log('new year vacation;', person.vacation_hours); 
                        pool.query(`UPDATE "employee" SET "vacation_hours" = ${person.vacation_hours} WHERE "id" = ${person.id}`)
                    });
                });

            })
}

// Runs January 1st
runJanuaryFirst();
module.exports = router;