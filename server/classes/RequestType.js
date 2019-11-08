const code = {
    VACATION: 1,
    SICK_AND_SAFE: 2
};

class RequestType {
    constructor(lookup) {
        this.lookup = lookup;
        this.columnName = RequestType.columnName(lookup);
    }

    static columnName(lookup) {
        if (lookup === code.VACATION) {
            return 'vacation_hours';
        } else if (lookup === code.SICK_AND_SAFE) {
            return 'sick_hours';
        } else {
            return undefined;
        }
    }

    getJSON() {
        return this.lookup;
    }
}

const requestType = module.exports = RequestType;
requestType.code = code;