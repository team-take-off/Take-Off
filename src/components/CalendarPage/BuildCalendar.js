import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestStatus from '../../classes/RequestStatus';
import RequestType from '../../classes/RequestType';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
moment.locale('en');
BigCalendar.momentLocalizer(moment);

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
    }

    componentDidMount() {
        // this.props.dispatch({ type: 'SET_FILTERS', payload: { active: true, startDate: '2018-10-26 01:00:00Z', endDate: '2020-10-26 01:00:00Z' } });
        this.props.dispatch({ type: 'SET_FILTERS', payload: { active: true } });
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.requests !== this.props.requests) {
            const events = [];
            const eventStyles = [];

            for (let request of this.props.requests) {
                const startMoment = moment(request.starDate);
                const endMoment = moment(request.endDate);
                const employee = `${request.employee.firstName} ${request.employee.lastName}`;
                const requestType = request.formatType();
                const pendingLabel = request.status.lookup === RequestStatus.PENDING ? ' (Pending)' : '';

                const calendarEvent = {
                    title: `${employee}: ${requestType} ${pendingLabel}`,
                    type: request.type.lookup,
                    start: startMoment,
                    end: endMoment.add(1, 'day')
                };
                events.push(calendarEvent);
            }

            this.setState({
                events
            });
        }
    }

    handleNavigate = (event) => {
        console.log(event);

    }

    eventProps = (event) => {
        console.log(event);
        if (event.type === RequestType.VACATION) {
            return {
                style: {
                    backgroundColor: '#88BB92'
                }
            }
        } else if (event.type === RequestType.SICK_AND_SAFE) {
            return {
                style: {
                    backgroundColor: '#F7934C'
                }
            }
        } else {
            return {
                style: {
                    backgroundColor: '#4D7298'
                }
            }
        }
    }

    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
        return (
            <div>
                <div style={{ height: '100vh' }}>
                    <BigCalendar
                        localizer={localizer}
                        events={this.state.events}
                        step={30}
                        defaultView='month'
                        views={['month']}
                        eventPropGetter={this.eventProps}
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