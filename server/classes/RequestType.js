const code = {
    VACATION: 1,
    SICK_AND_SAFE: 2
};

class RequestType {
    constructor(lookup) {
        this.columnName = undefined;
        if (lookup === code.VACATION) {
            this.columnName = 'vacation_hours';
        } else if (lookup === code.SICK_AND_SAFE) {
            this.columnName = 'sick_hours';
        }
    }
}

const requestType = module.exports = RequestType;
requestType.code = code;