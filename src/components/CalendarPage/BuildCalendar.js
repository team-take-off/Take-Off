import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
moment.locale('en');
BigCalendar.momentLocalizer(moment);

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendar_events: [],
        };
      }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requests !== this.props.requests) {
            const approved = this.props.requests.approved;
            const pending = this.props.requests.pending;
            
            for (let request of approved) {
                this.insertRequest(request);
            }
            for (let request of pending) {
                this.insertRequest(request);
            }
        }
    }

    insertRequest = (request) => {
        if (request.units.length === 0) {
            return;
        }

        const startUnit = request.units[0];
        const lastUnit = request.units[request.units.length - 1];

        const calendarEvent = {
            title: `${request.employee.firstName}: ${request.formatType()}`,
            start: moment(startUnit.date),
            end: moment(lastUnit.date).add(1, 'day')
        };

        this.setState(prevState => ({
            ...this.state,
            calendar_events: [...prevState.calendar_events, calendarEvent]
        }));
    }

    // sortBatchByDate = (batch) => {
    //     batch.sort((a, b) => {
    //         a = moment(a.date);
    //         b = moment(b.date);
    //         return a.diff(b);
    //     });
    // }

    eventStyle = (event, start, end, isSelected) => {        
        var backgroundColor = event.title.includes('Vacation') ? '#88BB92' : '#F7934C';
        var style = {
            backgroundColor: backgroundColor
        };
        return {
            style: style
        };
    }

    // Show this component on the DOM
    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
        return (
            <div>
                <div style={{ height: '100vh' }}>
                    <BigCalendar
                        localizer={localizer}
                        events={this.state.calendar_events}
                        step={30}
                        defaultView='month'
                        views={['month']}
                        eventPropGetter={(this.eventStyle)}
                    />
                </div>
            </div>
        );
    }
}
export default BuildAdminCalendar;