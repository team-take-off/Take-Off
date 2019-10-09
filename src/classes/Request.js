import RequestUnit from "./RequestUnit";

import moment from 'moment';

class Request {
    constructor(id, employeeID, firstName, lastName, type, status, startDate, endDate, dateRequested, units) {
        this.id = id;
        this.employeeID = employeeID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
        this.status = status;
        this.startDate = moment(startDate);
        this.endDate = moment(endDate);
        this.dateRequested = moment(dateRequested);
        this.units = units;
    }

    static loadArray(array) {
        return array.map(
            request => {
                const units = RequestUnit.loadArray(request.request_units);
                // const collisions = Collision.loadArray()
                return new Request(
                    request.id,
                    request.employee_id,
                    request.first_name,
                    request.last_name,
                    request.type,
                    request.status,
                    request.start_date,
                    request.end_date,
                    request.date_requested,
                    units
                );
            });
    }
}

export default Request;