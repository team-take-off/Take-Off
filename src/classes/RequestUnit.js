import moment from 'moment';

import DayType from './DayType';

class RequestUnit {
    constructor(id, date, isFullDay, isMorning, isAfternoon, isBlank) {
        this.id = id;
        this.date = moment(date);
        this.dayType = new DayType(isFullDay, isMorning, isAfternoon, isBlank);
    }

    static loadArray(array) {
        if (array === undefined) {
            return [];
        }
        
        return array.map(
            unitElement => {
                return new RequestUnit(
                    unitElement.id,
                    unitElement.date,
                    unitElement.isFullday,
                    unitElement.isMorning,
                    unitElement.isAfternoon,
                    unitElement.isBlank
                );
            });
    }
}

export default RequestUnit;