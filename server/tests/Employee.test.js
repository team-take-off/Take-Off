Employee = require('../classes/Employee');
EmployeeRole = require('../classes/EmployeeRole');

describe('Employee constructor function', () => {
    test('Constructor running for simple input', () => {
        const employee = new Employee(1, 'Ada', 'Lovelace');

        expect(employee.id).toBe(1);
        expect(employee.firstName).toEqual('Ada');
        expect(employee.lastName).toEqual('Lovelace');
    });
});