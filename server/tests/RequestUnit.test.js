const moment = require('moment');
const RequestUnit = require('../classes/RequestUnit');

describe('RequestUnit constructor function', () => {
    test('Fullday is from 9 AM to 5 PM', () => {
        const start = moment('2019-10-22 09:00:00-05');
        const end = moment('2019-10-22 17:00:00-05');
        const unit = new RequestUnit(undefined, start, end);

        expect(unit.isFullday).toEqual(true);
        expect(unit.isAfternoon).toEqual(false);
        expect(unit.isMorning).toEqual(false);
        expect(unit.isBlank).toEqual(false);
        expect(unit.hours).toEqual(8);
        expect(unit.description).toEqual('fullday');
    });

    test('Morning is from 9 AM to 1 PM', () => {
        const start = moment('2019-10-22 09:00:00-05');
        const end = moment('2019-10-22 13:00:00-05');
        const unit = new RequestUnit(undefined, start, end);

        expect(unit.isFullday).toEqual(false);
        expect(unit.isAfternoon).toEqual(false);
        expect(unit.isMorning).toEqual(true);
        expect(unit.isBlank).toEqual(false);
        expect(unit.hours).toEqual(4);
        expect(unit.description).toEqual('morning');
    });

    test('Afternoon is from 1 PM to 5 PM', () => {
        const start = moment('2019-10-22 13:00:00-05');
        const end = moment('2019-10-22 17:00:00-05');
        const unit = new RequestUnit(undefined, start, end);

        expect(unit.isFullday).toEqual(false);
        expect(unit.isAfternoon).toEqual(true);
        expect(unit.isMorning).toEqual(false);
        expect(unit.isBlank).toEqual(false);
        expect(unit.hours).toEqual(4);
        expect(unit.description).toEqual('afternoon');
    });

    test('Empty arguments should produce a blank', () => {
        const unit = new RequestUnit();

        expect(unit.isFullday).toEqual(false);
        expect(unit.isAfternoon).toEqual(false);
        expect(unit.isMorning).toEqual(false);
        expect(unit.isBlank).toEqual(true);
        expect(unit.hours).toEqual(0);
        expect(unit.description).toEqual('blank');
    });

    test('Invalid arguments should produce a blank', () => {
        const start = moment('2019-10-22 08:00:00-05');
        const end = moment('2019-10-22 17:00:00-05');
        const unit = new RequestUnit(undefined, start, end);

        expect(unit.isFullday).toEqual(false);
        expect(unit.isAfternoon).toEqual(false);
        expect(unit.isMorning).toEqual(false);
        expect(unit.isBlank).toEqual(true);
        expect(unit.hours).toEqual(0);
        expect(unit.description).toEqual('blank');
    });
});

describe('RequestUnit function findUnits', () => {
    test('A span of one day produces an array of one unit', () => {
        const start = moment('2019-10-22T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-22T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(1);
        expect(unitArray[0].isFullday).toEqual(true);
    });

    test('A span of several days produces an array of the same number of units', () => {
        const start = moment('2019-10-22T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-24T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(3);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isFullday).toEqual(true);
        expect(unitArray[2].isFullday).toEqual(true);
    });

    test('A span with leading afternoon', () => {
        const start = moment('2019-10-22T13:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-23T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(2);
        expect(unitArray[0].isAfternoon).toEqual(true);
        expect(unitArray[1].isFullday).toEqual(true);
    });

    test('A span with trailing morning', () => {
        const start = moment('2019-10-22T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-23T13:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(2);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isMorning).toEqual(true);
    });

    test('Leading and trailing weekends should be trimmed', () => {
        const start = moment('2019-10-19T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-27T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(5);
    });

    test('Weekends in the middle of a span should be included as blanks', () => {
        const start = moment('2019-10-18T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-21T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(4);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isBlank).toEqual(true);
        expect(unitArray[2].isBlank).toEqual(true);
        expect(unitArray[3].isFullday).toEqual(true);
    });

    test('Weekends in the middle of a span should be included as blanks', () => {
        const start = moment('2019-10-18T13:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-21T13:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(4);
        expect(unitArray[0].isAfternoon).toEqual(true);
        expect(unitArray[1].isBlank).toEqual(true);
        expect(unitArray[2].isBlank).toEqual(true);
        expect(unitArray[3].isMorning).toEqual(true);
    });

    test('Holidays (Chistmas Eve and Christmas) in the middle of a span should be included as blanks', () => {
        const start = moment('2019-12-23T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-12-26T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(4);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isBlank).toEqual(true);
        expect(unitArray[2].isBlank).toEqual(true);
        expect(unitArray[3].isFullday).toEqual(true);
    });

    test('Holidays (New Years Day) in the middle of a span should be included as blanks', () => {
        const start = moment('2018-12-31T09:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-01-02T17:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(3);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isBlank).toBe(true);
        expect(unitArray[2].isFullday).toBe(true);
    });

    test('Irregular spans from 8 AM to 6 PM should still work', () => {
        const start = moment('2019-10-22T08:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-23T18:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(2);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isFullday).toEqual(true);
    });

    test('Irregular spans from 8 AM to 2 PM should still work', () => {
        const start = moment('2019-10-22T08:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-23T14:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(2);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isMorning).toEqual(true);
    });

    test('Irregular spans from 12 PM to 6 PM should still work', () => {
        const start = moment('2019-10-22T12:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-23T18:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(2);
        expect(unitArray[0].isAfternoon).toEqual(true);
        expect(unitArray[1].isFullday).toEqual(true);
    });

    test('Irregular spans from 4 AM to 4 PM should still work', () => {
        const start = moment('2019-10-22T04:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const end = moment('2019-10-23T16:00:00Z', 'YYYY-MM-DDTHH:mm:ssZ');
        const unitArray = RequestUnit.findUnits(start, end);

        expect(unitArray.length).toEqual(2);
        expect(unitArray[0].isFullday).toEqual(true);
        expect(unitArray[1].isMorning).toEqual(true);
    });
});