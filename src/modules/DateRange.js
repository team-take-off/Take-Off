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

        // Build a human readable output string and condense all contiguous 
        // dates into date ranges such as 'April 1, 2019 to April 3, 2019'.
        let outputString = moments[0].format(outputFormat);
        for (let i = 1; i < moments.length; i++) {
            if (i === moments.length - 1) {
                outputString += ` to ${moments[i].format(outputFormat)}`;
            } else if (moments[i + 1].diff(moments[i], 'days') > 1) {
                outputString += ` to ${moments[i].format(outputFormat)} and ${moments[i + 1].format(outputFormat)}`;
                i += 1;
            }
        }
        return outputString;
    }
}

export default DateRange;