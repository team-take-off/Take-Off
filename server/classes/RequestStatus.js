const code = {
    PENDING: 1,
    APPROVED: 2,
    DENIED: 3
};

class RequestStatus {
    constructor(lookup) {
        this.pending = false;
        this.approved = false;
        this.denied = false;

        if (lookup === code.PENDING) {
            this.pending = true;
        } else if (lookup === code.APPROVED) {
            this.approved = true;
        } else if (lookup === code.DENIED) {
            this.denied = true;
        }
    }
}

const requestStatus = module.exports = RequestStatus;
requestStatus.code = code;