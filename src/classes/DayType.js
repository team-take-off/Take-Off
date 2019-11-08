class DayType {
    constructor(isFullDay, isMorning, isAfternoon, isBlank) {
        if (isFullDay) {
            this.description = 'fullday';
        } else if (isMorning) {
            this.description = 'morning';
        } else if (isAfternoon) {
            this.description = 'afternoon';
        } else if (isBlank) {
            this.description = 'blank';
        }
    }
}

export default DayType;