Employee = require('../classes/Employee');
EmployeeRole = require('../classes/EmployeeRole');

describe('Employee constructor function', () => {
    test('Constructor running for simple input', () => {
        const employee = new Employee(1, true, new EmployeeRole(EmployeeRole.code.EMPLOYEE));

        expect(employee.id).toBe(1);
        expect(employee.active).toBe(true);
        expect(employee.role.isEmployee()).toBe(true);
        expect(employee.role.isAdministrator()).toBe(false);
    });
});