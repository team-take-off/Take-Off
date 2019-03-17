import React, { Component } from 'react';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('en-US');
BigCalendar.momentLocalizer(moment);
class AdminCalendarPage extends Component {

    // Show this component on the DOM
    render() {
        return (
            <div>
                <p>[ AdminCalenda  rPage ]</p>
            </div>
        );
    }
}

export default AdminCalendarPage;