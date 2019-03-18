import React, { Component } from 'react';
import DateRange from '../../modules/DateRange';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// moment.locale('en-GB');
BigCalendar.momentLocalizer(moment);

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            calendar_events: [ {start: new Date(), end: new Date(moment().add(1, 'days')), allDay: false}],
        }
      }
    configureEvent = () => {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requests !== this.props.requests) {
        console.log(this.props.requests);
        const requests = this.props.requests;



        // this.setState({
        //     calendar_events: {
        //         start: ,
        //         end: ,

        //     }
        // })
        }
    }
        
      // Returns an array with unique batch_of_request_id
    filterUniqueBatchIDs = (requests) => {
        let uniqueObject = {};
        for (let request of requests) {
            uniqueObject[request.batch_of_requests_id] = 1;
        }
        let uniqueArray = [];
        for (let id in uniqueObject) {
            uniqueArray.push(parseInt(id));
        }
        return uniqueArray;
    }
        
      
    // Show this component on the DOM
    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
    return (
      <div>
            <div style={{ height: 700 }}>
                <BigCalendar
                    localizer={localizer}
                    events={this.state.calendar_events}
                    step={30}
                    defaultView='month'
                    views={['month', 'week']}
                    defaultDate={new Date()}
                />
            </div>
        </div>
        );
    }
}
export default BuildAdminCalendar;