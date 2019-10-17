const moment = require('moment');
const { isHoliday } = require('moment-holiday');

class CompanyHolidays {
    constructor() {

    }

    static isDayOff(queryDate) {
        const observedHolidays = [
            'New Years Day',
            'Martin Luther King Jr. Day',
            'Washingtons Birthday',
            'Memorial Day',
            'Independence Day',
            'Labor Day',
            'Veterans Day',
            'Thanksgiving Day',
            'Christmas Eve',
            'Christmas Day'
        ];

        // Note: Library moment-holiday incorrectly finds 'Day after Thanksgiving'
        // for years where November 1st falls on Friday.
        if (queryDate.month() === 10 && queryDate.day() === 5 && queryDate.date() >= 23 && queryDate.date() < 30) {
            return true;
        }
        return queryDate.isHoliday(observedHolidays);
    }

    static listHolidays(startDate, endDate) {
        let list = [];
        let current = moment(startDate);
        while (current.isBefore(endDate)) {
            if (CompanyHolidays.isDayOff(current)) {
                list.push(moment(current));
            }
            current.add(1, 'days');
        }
        return list;
    }
}

module.exports = CompanyHolidays;