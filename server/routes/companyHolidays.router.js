const express = require('express');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

const CompanyHolidays = require('../classes/CompanyHolidays');

// Route GET /api/company-holidays
// Returns an array all company holidays between the two dates
router.get('/', rejectUnauthenticated, (req, res) => {
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    const holidays = CompanyHolidays.listHolidays(startDate, endDate);
    res.send(holidays);
});

module.exports = router;