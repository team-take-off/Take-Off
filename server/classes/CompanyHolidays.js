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
            return { title: 'Day After Thanksgiving', date: queryDate.format('YYYY-MM-DDTHH:mm:ssZ') };
        }
        if (queryDate.isHoliday(observedHolidays)) {
            for (let holidayString of observedHolidays) {
                if (queryDate.isHoliday([holidayString])) {
                    return { title: holidayString, date: queryDate.format('YYYY-MM-DDTHH:mm:ssZ') };
                }
            }
        }
        return false;
    }

    static listHolidays(startDate, endDate) {
        let currentMoment = moment(startDate.data);
        const endMoment = moment(endDate.data);

        let list = [];        
        while (currentMoment.isBefore(endMoment)) {
            const dayOff = CompanyHolidays.isDayOff(currentMoment)
            if (dayOff) {
                list.push(dayOff);
            }
            currentMoment.add(1, 'days');
        }
        return list;
    }
}

module.exports = CompanyHolidays;