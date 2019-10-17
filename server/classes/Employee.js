EmployeeRole = require('./EmployeeRole');

class Employee {
    constructor(userSession) {
        this.id = userSession.id;
        this.active = userSession.is_active;
        this.role = new EmployeeRole(userSession.role_id);
    }

    isActive() {
        return this.active;
    }
}

module.exports = Employee;