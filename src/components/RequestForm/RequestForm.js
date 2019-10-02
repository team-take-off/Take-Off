import React, { Component } from 'react';
import { connect } from 'react-redux';
// import swal from 'sweetalert';
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

    setStartHours = (event) => {
        const action = {
            type: (this.props.typeid === 1 ? 'SET_VACATION_START_HOURS' : 'SET_SICK_START_HOURS'),
            payload: parseInt(event.target.value)
        };
        this.props.dispatch(action);
    }

    setEndHours = (event) => {
        const action = {
            type: (this.props.typeid === 1 ? 'SET_VACATION_END_HOURS' : 'SET_SICK_END_HOURS'),
            payload: parseInt(event.target.value)
        };
        this.props.dispatch(action);
    }

    submit = (event) => {
        event.preventDefault();
        // swal({
        //     title: 'Submit Request?',
        //     text: 'Your request will be submitted',
        //     icon: 'info',
        //     buttons: true,
        // }).then((willRequest) => {
        //     if (willRequest) {
        //         const startDate = moment(this.props.type.startDate, 'YYYY-MM-DD');
        //         const endDate = moment(this.props.type.endDate, 'YYYY-MM-DD');
        //         const numberOfDays = endDate.diff(startDate, 'days') + 1;
        //         let requestArray = [];
        //         let currentDate = moment(this.props.type.startDate, 'YYYY-MM-DD');
        //         for (let i = 0; i < numberOfDays; i++) {
        //             if (i === 0) {
        //                 requestArray.push({ date: currentDate.format('YYYY-MM-DD'), hours: this.props.type.startHours });
        //             } else if (i === numberOfDays - 1) {
        //                 requestArray.push({ date: currentDate.format('YYYY-MM-DD'), hours: this.props.type.endHours });
        //             } else {
        //                 requestArray.push({ date: currentDate.format('YYYY-MM-DD'), hours: 8 });
        //             }
        //             currentDate.add(1, 'days');
        //         }

                const action = {
                    type: 'ADD_USER_REQUEST',
                    payload: {
                        typeID: this.props.typeid,
                        startDate: moment('2019-09-22').set('hour', 9),
                        endDate: moment('2019-09-24').set('hour', 17),
                        dryRun: false
                    }
                };
                this.props.dispatch(action);
                this.props.history.push('/my_requests');
        //         swal('Request Submitted', {
        //             icon: 'success',
        //         });
        //     } else {
        //         swal("Request Cancelled");
        //     }
        // });
    }

    // Show this component on the DOM
    render() {
    
        let dateVal;
        if (this.props.type.startDate > this.props.type.endDate) {
            dateVal = moment(this.props.type.startDate).format('YYYY-MM-DD');
        } else {
            dateVal=this.props.type.endDate;
        }
        let fullHalf;
        if (this.props.type.startDate === this.props.type.endDate) {
            fullHalf = (
                <select disabled onChange={this.setEndHours} value={this.props.type.endHours} >
                    <option value="8">Full Day</option>
                    <option value="4">Half Day</option>
                </select>
            );
        } else {
            fullHalf = (
                <select onChange={this.setEndHours} value={this.props.type.endHours}>
                    <option value="8">Full Day</option>
                    <option value="4">Half Day</option>
                </select>
            );
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
