const role = {
    ADMINISTRATOR: 1,
    EMPLOYEE: 2
};

class EmployeeRole {
    constructor(lookup) {
        this.administrator = false;
        this.employee = false;

        if (lookup === role.ADMINISTRATOR) {
            this.administrator = true;
        } else if (lookup === role.EMPLOYEE) {
            this.employee = true;
        }
    }

    isAdministrator() {
        return this.administrator;
    }

    isEmployee() {
        return this.employee;
    }
}

const employeeRole = module.exports = EmployeeRole;
employeeRole.id = role;