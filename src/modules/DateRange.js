import moment from 'moment';

class DateRange {
    constructor(requestArray) {
        // Read in an array of objects with the attribute 'date:' and convert
        // to an array of class 'moment' from Moment.js.
        this.momentArray = [];
        for (let element of requestArray) {
            this.momentArray.push(moment(element.date));
        }

        // Sort the array of moments
        this.momentArray.sort((left, right) => {
            return left.diff(right);
        });
    }

    format = (outputFormat) => {
        const moments = this.momentArray;
        if (moments.length === 0) {
            return '';
        }

        // Build a human readable output string 
        let outputString = moments[0].format(outputFormat);
        if (moments.length > 1) {
            outputString += ` thru ${moments[moments.length - 1].format(outputFormat)}`;
        }
        return outputString;
    }
}

export default DateRange;