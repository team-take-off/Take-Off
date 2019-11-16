import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import RequestType from '../../classes/RequestType';
import RequestStatus from '../../classes/RequestStatus';

const START_HOUR = 9;
const MIDDAY_HOUR = 13;
const END_HOUR = 17;

const getStartHour = (dayType) => {
    if (dayType === 'fullday' || dayType === 'morning') {
        return START_HOUR;
    } else if (dayType === 'afternoon') {
        return MIDDAY_HOUR;
    } else {
        return -1;
    }
}

const getEndHour = (dayType) => {
    if (dayType === 'fullday' || dayType === 'afternoon') {
        return END_HOUR;
    } else if (dayType === 'morning') {
        return MIDDAY_HOUR;
    } else {
        return -1;
    }
}

class RequestForm extends Component {

    setStartDate = async (event) => {
        const action = {
            type: (this.props.typeid === RequestType.VACATION ? 'SET_VACATION_START_DATE' : 'SET_SICK_START_DATE'),
            payload: event.target.value
        };
        await this.props.dispatch(action);
    }

    setEndDate = async (event) => {
        const action = {
            type: (this.props.typeid === RequestType.VACATION ? 'SET_VACATION_END_DATE' : 'SET_SICK_END_DATE'),
            payload: event.target.value
        };
        await this.props.dispatch(action);
    }

    setStartDayType = async (event) => {
        const dayType = event.target.value;
        const action = {
            type: (this.props.typeid === RequestType.VACATION ? 'SET_VACATION_START_DAY_TYPE' : 'SET_SICK_START_DAY_TYPE'),
            payload: dayType
        };
        await this.props.dispatch(action);

        if (this.props.type.startDate === this.props.type.endDate) {
            const actionMatchStart = {
                type: (this.props.typeid === RequestType.VACATION ? 'SET_VACATION_END_DAY_TYPE' : 'SET_SICK_END_DAY_TYPE'),
                payload: dayType
            };
            await this.props.dispatch(actionMatchStart);
        }
    }

    setEndDayType = async (event) => {
        const action = {
            type: (this.props.typeid === RequestType.VACATION ? 'SET_VACATION_END_DAY_TYPE' : 'SET_SICK_END_DAY_TYPE'),
            payload: event.target.value
        };
        await this.props.dispatch(action);
    }

    submit = async (event) => {
        event.preventDefault();
        const startDate = this.props.type.startDate;
        const startHour = getStartHour(this.props.type.startDayType);
        const endDate = this.props.type.endDate;
        const endHour = getEndHour(this.props.type.endDayType);

        const startMoment = moment(`${startDate} ${startHour} +0000`, 'YYYY-MM-DD HH Z').utc();
        const endMoment = moment(`${endDate} ${endHour} +0000`, 'YYYY-MM-DD HH Z').utc();

        const action = {
            type: 'ADD_REQUEST',
            payload: {
                user: this.props.reduxStore.user.id,
                type: this.props.typeid,
                startDate: startMoment.format(),
                endDate: endMoment.format(),
                employee: this.props.reduxStore.user.id,
                status: RequestStatus.PENDING
            }
        };
        await this.props.dispatch(action);
        await this.props.history.push('/my_requests');
    }

    // Show this component on the DOM
    render() {
    
        let dateVal;
        if (this.props.type.startDate > this.props.type.endDate) {
            dateVal = moment(this.props.type.startDate).format('YYYY-MM-DD');
        } else {
            dateVal = this.props.type.endDate;
        }
       
        return (
            <>
                <form onSubmit={this.submit}>
                    <label htmlFor="start_date">Start Date:</label>
                    <br />
                    <input
                        onChange={this.setStartDate}
                        name="start_date" 
                        type="date" 
                        min={moment().subtract(5, 'days').format('YYYY-MM-DD')} 
                        value={this.props.type.startDate}
                    />
                    <select onChange={this.setStartDayType} value={this.props.type.startDayType}>
                        <option value="fullday">Full Day</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select>
                    <br />
                    <br />
                    <label htmlFor="end_date">End Date:</label>
                    <br />
                    <input 
                        onChange={this.setEndDate} 
                        name="end_date" 
                        type="date" 
                        min={moment(this.props.type.startDate).format('YYYY-MM-DD')} 
                        value={dateVal}
                    />
                    <select disabled={this.props.type.startDate === this.props.type.endDate} onChange={this.setEndDayType} value={this.props.type.endDayType}>
                        <option value="fullday">Full Day</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                    </select>
                    <br />
                    <br />
                    <input type="submit" />
                </form>
            </>
        ) 
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RequestForm);
