class Employee {
    constructor(id, active, role) {
        this.id = id;
        this.active = active;
        this.role = role;
    }

    getJSON() {
        return {
            id: this.id,
            active: this.active,
            role: this.role.getJSON()
        };
    }
}

module.exports = Employee;