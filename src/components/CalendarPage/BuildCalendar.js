import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import RequestStatus from '../../classes/RequestStatus';
import RequestType from '../../classes/RequestType';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
moment.locale('en');
BigCalendar.momentLocalizer(moment);

const CALENDAR_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const HTTP_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            holidays: []
        };
    }

    componentDidMount() {
        const filters = {
            active: true,
            startDate: '2019-10-01T09:00:00Z',
            endDate: '2019-12-01T09:00:00Z',
        };
        // this.props.dispatch({ type: 'SET_FILTERS', payload: { active: true,  } });
        this.props.dispatch({ type: 'SET_FILTERS', payload: filters });
        axios.get('/api/company-holidays', { params: filters }).then(response => {
            this.setState({
                ...this.state,
                holidays: response.data
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.requests !== this.props.requests || prevState.holidays !== this.state.holidays) {
            const events = [];

            for (let holiday of this.state.holidays) {
                const startMoment = moment(holiday.date, HTTP_FORMAT);
                const endMoment = moment(holiday.date, HTTP_FORMAT);

                const calendarEvent = {
                    title: holiday.title,
                    type: 'HOLIDAY',
                    start: startMoment.format(CALENDAR_FORMAT),
                    end: endMoment.format(CALENDAR_FORMAT)
                };
                events.push(calendarEvent);
            }

            for (let request of this.props.requests) {
                const startMoment = moment(request.startDate);
                const endMoment = moment(request.endDate);
                const employee = `${request.employee.firstName} ${request.employee.lastName}`;
                const requestType = request.formatType();
                const pendingLabel = request.status.lookup === RequestStatus.PENDING ? ' (Pending)' : '';

                const calendarEvent = {
                    title: `${employee}: ${requestType} ${pendingLabel}`,
                    type: request.type.lookup,
                    start: startMoment.format(CALENDAR_FORMAT),
                    end: endMoment.format(CALENDAR_FORMAT)
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