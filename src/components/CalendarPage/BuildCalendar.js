import React, { Component } from 'react';
import axios from 'axios';

import Request from '../../classes/Request';
import RequestStatus from '../../classes/RequestStatus';
import RequestType from '../../classes/RequestType';

import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
moment.locale('en');
BigCalendar.momentLocalizer(moment);

const CALENDAR_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const HTTP_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ'

class BuildCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            requests: [],
            holidays: []
        };
    }

    componentDidMount() {
        const current = moment();
        current.utc();
        const filters = this.getFilters(current);
        this.fetchRequests(filters);
        this.fetchHolidays(filters);
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.requests !== this.state.requests || prevState.holidays !== this.state.holidays) {
            const events = [];

            for (let holiday of this.state.holidays) {
                const startMoment = moment(holiday.date, HTTP_FORMAT);
                startMoment.add(1, 'day');
                const endMoment = moment(holiday.date, HTTP_FORMAT);
                endMoment.add(1, 'day');

                const calendarEvent = {
                    title: holiday.title,
                    type: 'HOLIDAY',
                    start: startMoment.format(CALENDAR_FORMAT),
                    end: endMoment.format(CALENDAR_FORMAT)
                };
                events.push(calendarEvent);
            }

            for (let request of this.state.requests) {
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

    getFilters = (current) => {
        const startDate = moment(current).startOf('month').subtract(7, 'day');
        const endDate = moment(current).endOf('month').add(7, 'day');
        const filters = {
            active: true,
            startDate: startDate.format(HTTP_FORMAT),
            endDate: endDate.format(HTTP_FORMAT),
        };
        return filters;
    }

    fetchRequests = (filters) => {
        axios.get('/api/request', { params: filters }).then(response => {
            this.setState({
                ...this.state,
                requests: Request.loadArray(response.data)
            });
        });
    }

    fetchHolidays = (filters) => {
        axios.get('/api/company-holidays', { params: filters }).then(response => {
            this.setState({
                ...this.state,
                holidays: response.data
            });
        });
    }

    handleNavigate = (event) => {
        const current = moment(event, 'ddd MMM DD YYYY');
        current.utc();
        const filters = this.getFilters(current);
        this.fetchRequests(filters);
        this.fetchHolidays(filters);
    }

    eventProps = (event) => {
        const style = {
            fontSize: '12px',
            margin: '0',
            borderRadius: '2px'
        };

        if (event.type === RequestType.VACATION) {
            return {
                style: {
                    ...style,
                    backgroundColor: '#88BB92'
                }
            }
        } else if (event.type === RequestType.SICK_AND_SAFE) {
            return {
                style: {
                    ...style,
                    backgroundColor: '#F7934C'
                }
            }
        } else {
            return {
                style: {
                    ...style,
                    backgroundColor: '#4D7298'
                }
            }
        }
    }

    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
        return (
            <div>
                <div style={{ height: '140vh' }}>
                    <BigCalendar
                        localizer={localizer}
                        events={this.state.events}
                        step={30}
                        defaultView='month'
                        views={['month']}
                        eventPropGetter={this.eventProps}
                        onNavigate={this.handleNavigate}
                        style={{ height: '100%', fontSize: '16px', lineHeight: '20px' }}
                    />
                </div>
            </div>
        );
    }
}

export default BuildCalendar;