EmployeeRole = require('./EmployeeRole');

class User {
    constructor(userSession) {
        this.id = userSession.id;
        this.active = userSession.is_active;
        this.role = new EmployeeRole(Number(userSession.role_id));
    }

    isAdministrator() {
        if (this.active && this.role.isAdministrator()) {
            return true;
        }
        return false;
    }
}

module.exports = User;