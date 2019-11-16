const moment = require('moment');
const CompanyHolidays = require('./CompanyHolidays');

const MOMENT_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
const DATABASE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const hour = {
    START_DAY: 9,
    MID_DAY: 13,
    END_DAY: 17
};

const day = {
    SUNDAY: 0,
    SATURDAY: 6
};

const normalizeHours = (current) => {
    if (current.hour() <= hour.START_DAY) {
        current.hour(hour.START_DAY);
    } else if (current.hour() <= hour.MID_DAY) {
        current.hour(hour.MID_DAY);
    } else {
        current.add(1, 'days');
        current.hour(hour.START_DAY);
    }
};

const advanceTime = (current) => {
    if (current.hour() === hour.MID_DAY) {
        current.add(20, 'hours');
    } else {
        current.add(24, 'hours');
    }
};

const fullDayAhead = (current) => moment(current).add(8, 'hours');
const halfDayAhead = (current) => moment(current).add(4, 'hours');

class RequestUnit {
    constructor(id, start, end) {
        this.id = id;
        this.isFullday = false;
        this.isAfternoon = false;
        this.isMorning = false;
        this.isBlank = true;
        this.hours = 0;
        this.description = 'blank'; // TODO: Remove this after refactoring client-side

        if (start && end) {
            // this.startDate = moment(start, DATABASE_FORMAT).utc();
            // this.endDate = moment(end, DATABASE_FORMAT).utc();
            this.startDate = moment(start, DATABASE_FORMAT);
            this.endDate = moment(end, DATABASE_FORMAT);

            if (this.startDate.hour() === hour.START_DAY && this.endDate.hour() === hour.END_DAY) {
                this.isFullday = true;
                this.isBlank = false;
                this.hours = 8;
                this.description = 'fullday';
            } else if (this.startDate.hour() === hour.MID_DAY && this.endDate.hour() === hour.END_DAY) {
                this.isAfternoon = true;
                this.isBlank = false;
                this.hours = 4;
                this.description = 'afternoon';
            } else if (this.startDate.hour() === hour.START_DAY && this.endDate.hour() === hour.MID_DAY) {
                this.isMorning = true;
                this.isBlank = false;
                this.hours = 4;
                this.description = 'morning';
            }
        }
    }

    static findUnits(start, end) {
        this.startDate = moment(start, MOMENT_FORMAT).utc();
        this.endDate = moment(end, MOMENT_FORMAT).utc();

        let units = [];
        let current = moment(this.startDate);
        normalizeHours(current);

        while (current.isBefore(this.endDate)) {
            if (current.day() === day.SUNDAY || current.day() === day.SATURDAY || CompanyHolidays.isDayOff(current)) {
                // units.push(new RequestUnit());
                advanceTime(current);
                continue;
            }

            if (current.hour() === hour.START_DAY) {
                const nextFullDay = fullDayAhead(current);
                const nextHalfDay = halfDayAhead(current);
                if (nextFullDay.isSameOrBefore(this.endDate)) {
                    const newUnit = new RequestUnit(undefined, current, nextFullDay);
                    units.push(newUnit);
                } else if (nextHalfDay.isSameOrBefore(this.endDate)) {
                    const newUnit = new RequestUnit(undefined, current, nextHalfDay);
                    units.push(newUnit);
                }
            } else if (current.hour() === hour.MID_DAY) {
                const nextHalfDay = halfDayAhead(current);
                if (nextHalfDay.isSameOrBefore(this.endDate)) {
                    const newUnit = new RequestUnit(undefined, current, nextHalfDay);
                    units.push(newUnit);
                }
            }

            advanceTime(current);
        }

        let firstIndex;
        for (firstIndex = 0; firstIndex < units.length; firstIndex++) {
            if (!units[firstIndex].isBlank) {
                break;
            }
        }

        let lastIndex = units.length - 1;
        for (lastIndex; lastIndex >= 0; lastIndex--) {
            if (!units[lastIndex].isBlank) {
                break;
            }
        }

        return units.slice(firstIndex, lastIndex + 1);
    }

    getJSON() {
        return {
            id: this.id,
            date: this.startDate.format(),
            isFullday: this.isFullday,
            isAfternoon: this.isAfternoon,
            isMorning: this.isMorning,
            isBlank: this.isBlank
        }
    }
}

module.exports = RequestUnit;