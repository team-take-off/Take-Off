import DateRange from '../classes/DateRange';
import RequestUnit from '../classes/RequestUnit';

describe('DateRange formatting', () => {
    test('Should format a one day range as a single date.', () => {
        const units = [new RequestUnit(1, '10-08-2001', true, false, false)];
        const dateRange = new DateRange(units);
        const formatted = dateRange.format('LL');

        expect(formatted).toEqual('October 8, 2001');
    });

    test('Should conclude formatted string with \'(morning)\' when appropriate.', () => {
        const units = [new RequestUnit(1, '10-08-2001', false, true, false)];
        const dateRange = new DateRange(units);
        const formatted = dateRange.format('LL');

        expect(formatted).toEqual('October 8, 2001 (morning)');
    });

    test('Should conclude formatted string with \'(afternoon)\' when appropriate.', () => {
        const units = [new RequestUnit(1, '10-08-2001', false, false, true)];
        const dateRange = new DateRange(units);
        const formatted = dateRange.format('LL');

        expect(formatted).toEqual('October 8, 2001 (afternoon)');
    });

    test('Should format multiple days as a range date.', () => {
        const units = [new RequestUnit(1, '10-01-2001', true, false, false), new RequestUnit(1, '10-10-2001', true, false, false)];
        const dateRange = new DateRange(units);
        const formatted = dateRange.format('LL');

        expect(formatted).toEqual('October 1, 2001 — October 10, 2001');
    });

    test('Should format morning and afternoon in ranges where needed.', () => {
        const units = [new RequestUnit(1, '10-01-2001', false, false, true), new RequestUnit(1, '10-10-2001', false, true, false)];
        const dateRange = new DateRange(units);
        const formatted = dateRange.format('LL');

        expect(formatted).toEqual('October 1, 2001 (afternoon) — October 10, 2001 (morning)');
    });
});
