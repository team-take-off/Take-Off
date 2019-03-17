import React, { Component } from 'react';
import {connect} from 'react-redux';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// moment.locale('en-GB');
BigCalendar.momentLocalizer(moment);

class AdminCalendarPage extends Component {
    constructor() {
        super()
        //Declare state variables here
      }
      componentDidMount() { 
        //Fetch events from database here
      }
    // Show this component on the DOM
    render() {
        const cal_events = []
        const localizer = BigCalendar.momentLocalizer(moment);
    return (
      <div>
            <div style={{ height: 700 }}>
                <BigCalendar
                    localizer={localizer}
                    events={cal_events}
                    step={30}
                    defaultView='week'
                    views={['month','week','day']}
                    defaultDate={new Date()}
                />
            </div>
        </div>
        );
    }
}
const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});
export default connect(mapReduxStoreToProps)(AdminCalendarPage);