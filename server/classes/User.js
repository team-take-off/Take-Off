EmployeeRole = require('./EmployeeRole');

class User {
    constructor(userSession) {
        this.id = userSession.id;
        this.active = userSession.is_active;
        this.role = new EmployeeRole(Number(userSession.role_id));
    }

    getID() {
        return this.id;
    }

    isActive() {
        return this.active;
    }

    isAdministrator() {
        if (this.isActive() && this.role.isAdministrator()) {
            return true;
        }
        return false;
    }
}

module.exports = User;