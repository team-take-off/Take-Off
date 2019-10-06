import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';


class RequestForm extends Component {

    setStartDate = (event) => {
        const action = {
            type: (this.props.typeid === 1 ? 'SET_VACATION_START_DATE' : 'SET_SICK_START_DATE'),
            payload: event.target.value
        };
        this.props.dispatch(action);
    }

    setEndDate = (event) => {
        const action = {
            type: (this.props.typeid === 1 ? 'SET_VACATION_END_DATE' : 'SET_SICK_END_DATE'),
            payload: event.target.value
        };
        this.props.dispatch(action);
    }

    setStartDayType = (event) => {
        const action = {
            type: (this.props.typeid === 1 ? 'SET_VACATION_START_DAY_TYPE' : 'SET_SICK_START_DAY_TYPE'),
            payload: event.target.value
        };
        this.props.dispatch(action);
    }

    setEndDayType = (event) => {
        const action = {
            type: (this.props.typeid === 1 ? 'SET_VACATION_END_DAY_TYPE' : 'SET_SICK_END_DAY_TYPE'),
            payload: event.target.value
        };
        this.props.dispatch(action);
    }

    submit = async (event) => {
        event.preventDefault();
        const startHour = this.props.type.startDayType === 'afternoon' ? 13 : 9;
        const endHour = this.props.type.endDayType === 'morning' ? 13 : 17;
        const action = {
            type: 'ADD_USER_REQUEST',
            payload: {
                typeID: this.props.typeid,
                startDate: moment(this.props.type.startDate).set('hour', startHour),
                endDate: moment(this.props.type.endDate).set('hour', endHour),
                dryRun: false
            }
        };
        await this.props.dispatch(action);
        await this.props.history.push('/my_requests');
        // Set dryrunUnits to default
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
            <form onSubmit={this.submit}>
                <label htmlFor="start_date">Start Date:</label>
                <br />
                <input
                    onChange={this.setStartDate}
                    name="start_date" 
                    type="date" 
                    min={moment().subtract(7, 'days').format('YYYY-MM-DD')} 
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
                <select disabled={this.props.type.startDate === this.props.type.endDate} onChange={this.setEndDayType} value={this.props.type.startDate === this.props.type.endDate ? this.props.type.startDayType : this.props.type.endDayType}>
                    <option value="fullday">Full Day</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                </select>
                <br />
                <br />
                <input type="submit" />
            </form>
        ) 
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RequestForm);
