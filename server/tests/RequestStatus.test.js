const RequestStatus = require('../classes/RequestStatus');

describe('RequestStatus ID lookups', () => {
    test('Type ID of 1 implies status is approved', () => {
        const status = new RequestStatus(RequestStatus.code.APPROVED);
        expect(status.approved).toEqual(true);
        expect(status.pending).toEqual(false);
        expect(status.denied).toEqual(false);
    });

    test('Type ID of 2 implies status is pending', () => {
        const status = new RequestStatus(RequestStatus.code.PENDING);
        expect(status.approved).toEqual(false);
        expect(status.pending).toEqual(true);
        expect(status.denied).toEqual(false);
    });

    test('Type ID of 3 implies status is denied', () => {
        const status = new RequestStatus(RequestStatus.code.DENIED);
        expect(status.approved).toEqual(false);
        expect(status.pending).toEqual(false);
        expect(status.denied).toEqual(true);
    });
});