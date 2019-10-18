const moment = require('moment');
const Employee = require('./Employee');
const RequestStatus = require('./RequestStatus');
const RequestType = require('./RequestType');
const RequestUnit = require('./RequestUnit');

class Request {
    constructor(id, employee, typeID, statusID, startDate, endDate) {
        this.id = id;
        this.employee = employee;
        this.type = new RequestType(typeID);
        this.status = new RequestStatus(statusID);
        this.startDate = moment(startDate);
        this.endDate = moment(endDate);
        this.units = [];
        this.collisions = [];
    }

    addUnit(unit) {
        this.units.push(unit.getJSON());
    }

    static loadQuery(rows) {
        const uniqueGroupIDs = [];
        const groupArray = [];

        for (let row of rows) {
            const id = row.id;
            const index = uniqueGroupIDs.indexOf(id);
            if (index < 0) {
                uniqueGroupIDs.push(id);
                const unit = new RequestUnit(row.request_unit_id, row.unit_start_date, row.unit_end_date);
                const employee = new Employee(row.employee_id, row.first_name, row.last_name);
                const request = new Request(id, employee, row.type_id, row.status_id, row.start_date, row.end_date);
                request.addUnit(unit);
                groupArray.push(request);
            } else {
                const unit = new RequestUnit(row.request_unit_id, row.unit_start_date, row.unit_end_date);
                groupArray[index].addUnit(unit);
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
            endDate: this.endDate.format(),
            dateRequested: this.dateRequested.format(),
            units: this.units,
            collisions: []
        };
    }
}

module.exports = Request;