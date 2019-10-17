const RequestType = require('../classes/RequestType');

describe('RequestType ID lookups', () => {
    test('Type ID of 1 implies database column name will be \'vacation_hours\'', () => {
        const type = new RequestType(RequestType.code.VACATION);
        expect(type.columnName).toEqual('vacation_hours');
    });

    test('Type ID of 2 implies database column name will be \'sick_hours\'', () => {
        const type = new RequestType(RequestType.code.SICK_AND_SAFE);
        expect(type.columnName).toEqual('sick_hours');
    });
});