import RequestUnit from "./RequestUnit";

import moment from 'moment';

class Request {
    constructor(id, employeeID, firstName, lastName, type, status, dateRequested, units) {
        this.id = id;
        this.employeeID = employeeID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
        this.status = status;
        this.dateRequested = moment(dateRequested);
        this.units = units;
    }

    static loadArray(array) {
        return array.map(
            requestArray => {
                const units = RequestUnit.loadArray(requestArray);
                return new Request(
                    requestArray[0].id,
                    requestArray[0].employee_id,
                    requestArray[0].first_name,
                    requestArray[0].last_name,
                    requestArray[0].type,
                    requestArray[0].status,
                    requestArray[0].date_requested,
                    units
                );
            });
    }
}

export default Request;