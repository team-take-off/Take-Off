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
            
            for (let batch of approved) {
                this.insertBatch(batch);
            }
            for (let batch of pending) {
                this.insertBatch(batch);
            }
        }
    }

    insertBatch = (batch) => {
        if (batch.length === 0) {
            return;
        }

        this.sortBatchByDate(batch);
        const start = batch[0];
        const end = batch[batch.length - 1];

        const newCalendarEvent = {
            title: `${start.first_name}: ${start.type}`,
            start: moment(start.date),
            end: moment(end.date).add(1, 'day')
        };

        this.setState(prevState => ({
            ...this.state,
            calendar_events: [...prevState.calendar_events, newCalendarEvent]
        }));
    }

    sortBatchByDate = (batch) => {
        batch.sort((a, b) => {
            a = moment(a.date);
            b = moment(b.date);
            return a.diff(b);
        });
    }

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