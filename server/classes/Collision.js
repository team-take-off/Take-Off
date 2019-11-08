const moment = require('moment');
const Employee = require('./Employee');
const RequestStatus = require('./RequestStatus');
const RequestType = require('./RequestType');

class Collision {
    constructor(id, employee, typeID, statusID, startDate, endDate) {
        this.id = id;
        this.employee = employee;
        this.type = new RequestType(typeID);
        this.status = new RequestStatus(statusID);
        this.startDate = moment(startDate);
        this.endDate = moment(endDate);
    }

    static loadQuery(rows) {
        const uniqueGroupIDs = [];
        const groupArray = [];

        for (let row of rows) {
            const id = row.time_off_request_id;
            const index = uniqueGroupIDs.indexOf(id);
            if (index < 0) {
                uniqueGroupIDs.push(id);
                const employee = new Employee(row.employee_id, row.first_name, row.last_name);
                const collision = new Collision(id, employee, row.type_id, row.status_id, row.start_date, row.end_date);
                groupArray.push(collision.getJSON());
            }
        }
        return groupArray;
    }

    getJSON() {
        return {
            id: this.id,
            employee: this.employee.getJSON(),
            type: this.type.getJSON(),
            status: this.status.getJSON(),
            startDate: this.startDate.format(),
            endDate: this.endDate.format()
        };
    }
}

module.exports = Collision;