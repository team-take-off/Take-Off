const vacationRequestDates = (state = [''], action) => {
    switch (action.type) {
        case 'APPEND_VACATION_REQUEST':
            return [...state, ''];
        case 'SET_VACATION_REQUEST':
            let index = action.payload.index;
            const newDate = action.payload.date;
            state.splice(index, 1, newDate);
            return [...state];
        case 'REMOVE_VACATION_REQUEST':
            if (state.length === 1) {
                return [''];
            } else {
                let index2 = action.payload.index;
                state.splice(index2, 1);
                return [...state];
            }
        default:
            return state;
    }
};

export default vacationRequestDates;