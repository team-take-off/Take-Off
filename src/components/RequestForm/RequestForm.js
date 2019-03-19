import React, { Component } from 'react';
import { connect } from 'react-redux';
const moment = require('moment-business-days');


class RequestForm extends Component {

    setStartDate = (event) => {    
        let typeString = '';
        if (this.props.typeid === 1) {
            typeString = 'SET_VACATION_START_DATE';
        } else {
            typeString = 'SET_SICK_START_DATE';
        }
        const action = {
            type: typeString,
            payload: event.target.value
        };
        this.props.dispatch(action);
    }
    setEndDate = (event) => {
       
        let typeString = '';
        if (this.props.typeid === 1) {
            typeString = 'SET_VACATION_END_DATE';
        } else {
            typeString = 'SET_SICK_END_DATE';
        }
        const action = {
            type: typeString,
            payload: event.target.value

        };
        this.props.dispatch(action);
    }

    setStartHours = (event) => {
        
        let typeString = '';
        if (this.props.typeid === 1) {
            typeString = 'SET_VACATION_START_HOURS';
        } else {
            typeString = 'SET_SICK_START_HOURS';
        }
        const action = {
            type: typeString,
            payload: parseInt(event.target.value)

        };
        this.props.dispatch(action);
    }

    setEndHours = (event) => {
      
        let typeString = '';
        if (this.props.typeid === 1) {
            typeString = 'SET_VACATION_END_HOURS';
        } else {
            typeString = 'SET_SICK_END_HOURS';
        }
        const action = {
            type: typeString,
            payload: parseInt(event.target.value)
        };
        this.props.dispatch(action);
    }

    submit = (event) => {
        event.preventDefault();
        let numberOfDays = moment(this.props.type.endDate).diff(this.props.type.startDate, 'days');
        let i = 0;
        let requestArray = [{ date: this.props.type.startDate, hours: this.props.type.startHours }];
        let dayToAdd = this.props.type.startDate
        while (i < numberOfDays - 1) {
            dayToAdd = moment(dayToAdd).add(1, 'days').format('YYYY-MM-DD')
            requestArray.push({ date: dayToAdd, hours: 8 });
            i++
        }
        requestArray.push({ date: this.props.type.endDate, hours: this.props.type.endHours })
       
        if (this.props.typeid === 1) {
            const action = {
                type: 'ADD_USER_REQUEST',
                payload: {
                    typeID: 1,
                    requestedDates: requestArray
                }
            };
            this.props.dispatch(action);
            this.props.history.push('/employee_requests');
        } else {
            const action = {
                type: 'ADD_USER_REQUEST',
                payload: {
                    typeID: 2,
                    requestedDates: requestArray
                }
            };
            this.props.dispatch(action);
            this.props.history.push('/employee_requests');
        }
    }

    // Show this component on the DOM
    render() {
    
        let dateVal;
        if(this.props.type.startDate>this.props.type.endDate){
            dateVal = moment(this.props.type.startDate).format('YYYY-MM-DD');
        }else{
            dateVal=this.props.type.endDate;
        }
        let fullHalf;
        if (this.props.type.startDate === this.props.type.endDate) {
            fullHalf = <select disabled onChange={this.setEndHours} value={this.props.reduxStore.vacationRequestDates.endHours} >
                <option value="8">Full Day</option>
                <option value="4">Half Day</option>
            </select>
        }else{
            fullHalf = <select onChange={this.setEndHours} value={this.props.reduxStore.vacationRequestDates.endHours}>
                <option value="8">Full Day</option>
                <option value="4">Half Day</option>
            </select>
        }
       
        return (
            <form onSubmit={this.submit}>
                < input onChange={this.setStartDate} type="date" min={moment().format('YYYY-MM-DD')} value={this.props.reduxStore.vacationRequestDates.startDate} />
                <select onChange={this.setStartHours} value={this.props.reduxStore.vacationRequestDates.startHours}>
                    <option value="8">Full Day</option>
                    <option value="4">Half Day</option>
                </select>
                <input onChange={this.setEndDate} type="date" min={moment(this.props.type.startDate).format('YYYY-MM-DD')} value={dateVal} />
                {fullHalf}
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
