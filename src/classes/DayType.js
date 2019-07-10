class DayType {
    constructor(isFullDay, isMorning, isAfternoon) {
        if (isFullDay) {
            this.description = 'fullday';
        } else if (isMorning) {
            this.description = 'morning';
        } else if (isAfternoon) {
            this.description = 'afternoon';
        }
    }
}

export default DayType;