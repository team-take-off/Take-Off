const moment = require('moment');
const CompanyHolidays = require('../classes/CompanyHolidays');

describe('CompanyHolidays function isHoliday', () => {
    test('Classify \'New Years Day\' a holiday', () => {
        const newYearsDay = moment('2010-01-01');
        expect(CompanyHolidays.isDayOff(newYearsDay)).toEqual(true);
    });

    test('Classify the day after \'New Years Day\' not a holiday', () => {
        const newYearsDay = moment('2010-01-02');
        expect(CompanyHolidays.isDayOff(newYearsDay)).toEqual(false);
    });
});

describe('CompanyHolidays function listHolidays', () => {
    test('For December thru January it should produce an array of holidays [\'Christmas Eve\', \'Christmas\', \'New Years Day\', \'Martin Luther King Jr.Day\']', () => {
        const startDate = moment('2010-12-01');
        const endDate = moment('2011-01-31');
        const result = CompanyHolidays.listHolidays(startDate, endDate);
        const holidays = [moment('2010-12-24'), moment('2010-12-25'), moment('2011-01-01'), moment('2011-01-17')];

        expect(result.length).toEqual(4);
        expect(result[0].isSame(holidays[0]));
        expect(result[1].isSame(holidays[1]));
        expect(result[2].isSame(holidays[2]));
        expect(result[3].isSame(holidays[3]));
    });
});