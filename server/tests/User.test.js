User = require('../classes/User');
EmployeeRole = require('../classes/EmployeeRole');

describe('User method getID', () => {
    test('Return the ID from user session', () => {
        const session = {
            id: 56,
            is_active: false,
            role_id: EmployeeRole.id.EMPLOYEE
        };
        const user = new User(session);

        expect(user.getID()).toEqual(56);
    });
});

describe('User method isActive', () => {
    test('Return false if the user session indicates false', () => {
        const session = {
            id: 56,
            is_active: false,
            role_id: EmployeeRole.id.EMPLOYEE
        };
        const user = new User(session);

        expect(user.isActive()).toEqual(false);
    });

    test('Return true if the user session indicates true', () => {
        const session = {
            id: 56,
            is_active: true,
            role_id: EmployeeRole.id.EMPLOYEE
        };
        const user = new User(session);

        expect(user.isActive()).toEqual(true);
    });
});

describe('User method isAdministrator', () => {
    test('Return true if and only if the user session indicates true and is active', () => {
        const session = {
            id: 56,
            is_active: true,
            role_id: EmployeeRole.id.ADMINISTRATOR
        };
        const user = new User(session);

        expect(user.isAdministrator()).toEqual(true);
    });

    test('Return false if not active in user session', () => {
        const session = {
            id: 56,
            is_active: false,
            role_id: EmployeeRole.id.ADMINISTRATOR
        };
        const user = new User(session);

        expect(user.isAdministrator()).toEqual(false);
    });

    test('Return false if not indicated in user session', () => {
        const session = {
            id: 56,
            is_active: true,
            role_id: EmployeeRole.id.EMPLOYEE
        };
        const user = new User(session);

        expect(user.isAdministrator()).toEqual(false);
    });
});