const moment = require('moment');

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm';
const HTTP_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DATABASE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATABASE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const format = {
    DEFAULT: DEFAULT_FORMAT,
    HTTP: HTTP_FORMAT,
    DATABASE: DATABASE_FORMAT,
    DATABASE_DATE: DATABASE_DATE_FORMAT
};

class Moment {
    constructor(string, readFormat) {
        if (string === null || string === undefined) {
            this.isNull = true;
        }
        if (readFormat === undefined) {
            this.data = moment(string + ' Z', DEFAULT_FORMAT + ' Z');
            this.data.utc();
        } else {
            this.data = moment(string, readFormat);
            this.data.utc();
        }
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
        if (this.isNull) {
            return null;
        }
        return this.data.format(formatToken);
    }

    formatHTTP() {
        if (this.isNull) {
            return null;
        }
        return this.data.format(HTTP_FORMAT);
    }

    formatDatabase() {
        if (this.isNull) {
            return null;
        }
        return this.data.format(DATABASE_FORMAT);
    }
}

const momentExport = module.exports = Moment;
momentExport.format = format;