EmployeeRole = require('../classes/EmployeeRole');

describe('EmployeeRole ID lookups', () => {
    test('Role ID of 1 implies administrator.', () => {
        const role = new EmployeeRole(1);

        expect(role.isAdministrator()).toEqual(true);
        expect(role.isEmployee()).toEqual(false);
    });

    test('Role ID of 2 implies non-administrator employee.', () => {
        const role = new EmployeeRole(2);

        expect(role.isAdministrator()).toEqual(false);
        expect(role.isEmployee()).toEqual(true);
    });
});