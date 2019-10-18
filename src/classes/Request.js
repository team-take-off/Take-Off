import RequestUnit from "./RequestUnit";

import moment from 'moment';

class Request {
    constructor(id, employee, type, status, startDate, endDate, units, collisions) {
        this.id = id;
        this.employee = employee;
        this.type = type;
        this.status = status;
        this.startDate = moment(startDate);
        this.endDate = moment(endDate);
        this.units = units;
        this.collisions = collisions;
    }

    formatType() {
        if (this.type.lookup === 1) {
            return 'Vacation';
        } else if (this.type.lookup === 2) {
            return 'Sick and Safe Leave';
        } else {
            return '[ Unknown Leave Type ]';
        }
    }

    getSpanClass() {
        if (this.type.lookup === 1) {
            return 'vacation';
        } else if (this.type.lookup === 2) {
            return 'sick';
        } else {
            return '';
        }
    }

    isPending() {
        return this.status.lookup === 1;
    }

    isApproved() {
        return this.status.lookup === 2;
    }

    isDenied() {
        return this.status.lookup === 3;
    }

    static loadArray(array) {
        if (array === undefined) {
            return [];
        }

        return array.map(
            request => {
                const units = RequestUnit.loadArray(request.units);
                const collisions = Request.loadArray(request.collisions);
                return new Request(
                    request.id,
                    request.employee,
                    request.type,
                    request.status,
                    request.startDate,
                    request.endDate,
                    units,
                    collisions
                );
            });
    }
}

export default Request;