const Moment = require('../classes/Moment');

describe('Moment constructor function', () => {
    test('Format the data October 22, 2019 various ways', () => {
        const time = new Moment('2019-10-22 17:00');

        expect(time.format('dddd, MMMM Do YYYY, h:mm:ss a')).toEqual('Tuesday, October 22nd 2019, 5:00:00 pm');
        expect(time.formatHTTP()).toEqual('2019-10-22T17:00:00+00:00');
        expect(time.formatDatabase()).toEqual('2019-10-22 17:00:00');
    });
});

describe('Moment loading functions', () => {
    test('Load date info from an HTTP request', () => {
        const time = new Moment();
        time.loadHTTP('2019-10-22T18:30:00+00:00');

        expect(time.format('dddd, MMMM Do YYYY, h:mm:ss a')).toEqual('Tuesday, October 22nd 2019, 6:30:00 pm');
        expect(time.formatHTTP()).toEqual('2019-10-22T18:30:00+00:00');
        expect(time.formatDatabase()).toEqual('2019-10-22 18:30:00');
    });

    test('Load date info from a database entry', () => {
        const time = new Moment();
        time.loadDatabase('2019-10-22 19:00:00');

        expect(time.format('dddd, MMMM Do YYYY, h:mm:ss a')).toEqual('Tuesday, October 22nd 2019, 7:00:00 pm');
        expect(time.formatHTTP()).toEqual('2019-10-22T19:00:00+00:00');
        expect(time.formatDatabase()).toEqual('2019-10-22 19:00:00');
    });

    test('Load date info from a database entry (date only)', () => {
        const time = new Moment();
        time.loadDatabaseDate('2019-10-22');

        expect(time.format('dddd, MMMM Do YYYY, h:mm:ss a')).toEqual('Tuesday, October 22nd 2019, 12:00:00 am');
        expect(time.formatHTTP()).toEqual('2019-10-22T00:00:00+00:00');
        expect(time.formatDatabase()).toEqual('2019-10-22 00:00:00');
    });
});