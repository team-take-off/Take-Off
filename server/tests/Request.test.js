const Employee = require('../classes/Employee');
const Request = require('../classes/Request');

describe('Request constructor function', () => {
    test('Constructor running with simple inputs', () => {
        const employee = new Employee(44, 'Ada', 'Lovelace');
        const request = new Request(22, employee, 1, 1, '2019-10-17', '2019-10-21');

        expect(request.id).toBe(22);
        expect(request.employee.id).toBe(44);
        expect(request.employee.firstName).toEqual('Ada');
        expect(request.employee.lastName).toEqual('Lovelace');
    });
});