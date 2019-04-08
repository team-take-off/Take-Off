import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
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
        swal({
                title: "Submit Request?",
                text: "Your Request will be submitted",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Request Submitted", {
                        icon: "success",
                        });
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
                    } else {
                        swal("Request Cancelled");
                    }
                }); //alert for submitting request
        
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
            fullHalf = <select disabled onChange={this.setEndHours} value={this.props.type.endHours} >
                <option value="8">Full Day</option>
                <option value="4">Half Day</option>
            </select>
        }else{
            fullHalf = <select onChange={this.setEndHours} value={this.props.type.endHours}>
                <option value="8">Full Day</option>
                <option value="4">Half Day</option>
            </select>
        }
       
        return (
            <form onSubmit={this.submit}>
                <label htmlFor="start_date">Start Date:</label>
                <br />
                <input onChange={this.setStartDate} name="start_date" type="date" min={moment().subtract(7, 'days').format('YYYY-MM-DD')} value={this.props.type.startDate} />
                <select onChange={this.setStartHours} value={this.props.type.startHours}>
                    <option value="8">Full Day</option>
                    <option value="4">Half Day</option>
                </select>
                <br />
                <br />
                <label htmlFor="end_date">End Date:</label>
                <br />
                <input onChange={this.setEndDate} name="end_date" type="date" min={moment(this.props.type.startDate).format('YYYY-MM-DD')} value={dateVal} />
                {fullHalf}
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
