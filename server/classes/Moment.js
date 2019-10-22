const moment = require('moment');

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm';
const HTTP_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DATABASE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATABASE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class Moment {
    constructor(string) {
        this.data = moment(string + ' Z', DEFAULT_FORMAT + ' Z');
        this.data.utc();
    }

    loadHTTP(string) {
        this.data = moment(string, HTTP_FORMAT);
        this.data.utc();
    }

    loadDatabase(string) {
        this.data = moment(string + ' Z', DATABASE_FORMAT + ' Z');
        this.data.utc();
    }

    loadDatabaseDate(string) {
        this.data = moment(string + ' Z', DATABASE_DATE_FORMAT + ' Z');
        this.data.utc();
    }

    format(formatToken) {
        return this.data.format(formatToken);
    }

    formatHTTP() {
        return this.data.format(HTTP_FORMAT);
    }

    formatDatabase() {
        return this.data.format(DATABASE_FORMAT);
    }
}

module.exports = Moment;