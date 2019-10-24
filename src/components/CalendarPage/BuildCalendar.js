import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
moment.locale('en');
BigCalendar.momentLocalizer(moment);

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarEvents: [],
        };
    }

    componentDidMount() {
        // this.props.dispatch({ type: 'SET_FILTERS', payload: { active: true, startDate: '2018-10-26 01:00:00Z', endDate: '2020-10-26 01:00:00Z' } });
        this.props.dispatch({ type: 'SET_FILTERS', payload: { active: true } });
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.requests !== this.props.requests) {            
            for (let request of this.props.requests) {
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
            title: `${request.employee.firstName} ${request.employee.lastName}: ${request.formatType()} ${request.status.lookup === 2 ? ' (Pending)' : ''}`,
            start: moment(startUnit.date),
            end: moment(lastUnit.date).add(1, 'day')
        };

        this.setState(prevState => ({
            ...this.state,
            calendarEvents: [...prevState.calendarEvents, calendarEvent]
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

    handleNavigate = (event) => {
        console.log(event);

    }

    // Show this component on the DOM
    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
        return (
            <div>
                <div style={{ height: '100vh' }}>
                    <BigCalendar
                        localizer={localizer}
                        events={this.state.calendarEvents}
                        step={30}
                        defaultView='month'
                        views={['month']}
                        eventPropGetter={(this.eventStyle)}
                        onNavigate={this.handleNavigate}
                    />
                </div>
            </div>
        );
    }
}

const mapReduxStoreToProps = reduxStore => ({
    requests: reduxStore.requests
});

export default connect(mapReduxStoreToProps)(BuildAdminCalendar);