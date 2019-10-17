User = require('../classes/User');
EmployeeRole = require('../classes/EmployeeRole');

describe('User property id', () => {
    test('Equal id from user session', () => {
        const session = {
            id: 56,
            is_active: false,
            role_id: EmployeeRole.code.EMPLOYEE
        };
        const user = new User(session);

        expect(user.id).toEqual(56);
    });
});

describe('User property active', () => {
    test('Equal is_active from the user session', () => {
        const session = {
            id: 56,
            is_active: false,
            role_id: EmployeeRole.code.EMPLOYEE
        };
        const user = new User(session);

        expect(user.active).toEqual(false);
    });

    test('Return true if the user session indicates true', () => {
        const session = {
            id: 56,
            is_active: true,
            role_id: EmployeeRole.code.EMPLOYEE
        };
        const user = new User(session);

        expect(user.active).toEqual(true);
    });
});

describe('User method isAdministrator', () => {
    test('Return true if and only if the user session indicates true and is active', () => {
        const session = {
            id: 56,
            is_active: true,
            role_id: EmployeeRole.code.ADMINISTRATOR
        };
        const user = new User(session);

        expect(user.isAdministrator()).toEqual(true);
    });

    test('Return false if not active in user session', () => {
        const session = {
            id: 56,
            is_active: false,
            role_id: EmployeeRole.code.ADMINISTRATOR
        };
        const user = new User(session);

        expect(user.isAdministrator()).toEqual(false);
    });

    test('Return false if not indicated in user session', () => {
        const session = {
            id: 56,
            is_active: true,
            role_id: EmployeeRole.code.EMPLOYEE
        };
        const user = new User(session);

        expect(user.isAdministrator()).toEqual(false);
    });
});