import moment from 'moment';

import DayType from './DayType';

class RequestUnit {
    constructor(id, date, isFullDay, isMorning, isAfternoon) {
        this.id = id;
        this.date = moment(date);
        this.dayType = new DayType(isFullDay, isMorning, isAfternoon);
    }

    static loadArray(array) {
        return array.map(
            unitElement => {
                return new RequestUnit(
                    unitElement.request_unit_id,
                    unitElement.date,
                    unitElement.is_fullday,
                    unitElement.is_morning,
                    unitElement.is_afternoon
                );
            });
    }
}

export default RequestUnit;