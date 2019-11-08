class Employee {
    constructor(id, firstName, lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName
        };
    }
}

module.exports = Employee;