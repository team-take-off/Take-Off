class DateRange {
    constructor(units) {
        this.units = units;
        this.units.sort((left, right) => {
            return left.date.diff(right.date);
        });
    }

    getUnit(index) {
        const unit = this.units[index];
        let dayTypeString = '';
        if (unit.dayType.description === 'morning') {
            dayTypeString = ' (morning)';
        } else if (unit.dayType.description === 'afternoon') {
            dayTypeString = ' (afternoon)';
        }
        return unit.date.format(this.outputFormat) + dayTypeString;
    }

    format = (outputFormat) => {
        this.outputFormat = outputFormat;
        if (this.units.length === 0) {
            return '';
        }

        let outputString = this.getUnit(0);
        if (this.units.length > 1) {
            outputString += ` — ${this.getUnit(this.units.length - 1)}`;
        }
        return outputString;
    }
}

export default DateRange;