const express = require('express');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const moment = require('moment');

const CompanyHolidays = require('../classes/CompanyHolidays');
const Moment = require('../classes/Moment');

// Route GET /api/company-holidays
// Returns an array all company holidays between the two dates
router.get('/', rejectUnauthenticated, (req, res) => {
    const startDate = new Moment(req.query.startDate, Moment.format.HTTP);
    const endDate = new Moment(req.query.endDate, Moment.format.HTTP);
    const holidays = CompanyHolidays.listHolidays(startDate, endDate);
    res.send(holidays);
});

module.exports = router;