import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment-business-days';

class TestCronPage extends Component {
    constructor(props){
        super(props)
        this.state={
            years:'',
            startDate: '',
            endDate: '',
            vacationStartDays: '',
            sickStartDays: '',
            vacationEndDays: '',
            sickEndDays: ''
        }
    }

    componentDidMount() {
        // this.addUserInfo();
    }

    setVacationStartDays= (event)=>{
        this.setState({
            ...this.state,
            vacationStartDays: event.target.value
        });
    }

    setSickStartDays = (event) => {
        this.setState({
            ...this.state,
            sickStartDays: event.target.value
        });
    }

    setYears = (event) => {
        this.setState({
            ...this.state,
            years: event.target.value
        });
    }

    setStartDate = (event) => {
        this.setState({
            ...this.state,
            startDate: event.target.value
        });
    }

    setEndDate = (event) => {
        this.setState({
            ...this.state,
            endDate: event.target.value
        });
    }

    submitData = (event) =>{
        let request = {
            years: this.state.years,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            vacationStartDays: this.state.vacationStartDays,
            sickStartDays: this.state.sickStartDays
        }
        axios({
            method: 'POST',
            url: '/api/test-cron',
            data: request
        }).then((response)=>{
            console.log('repsonse post TestCronPage', response);          
        }).catch((error)=>{
            console.log('error in axios post TestCronPage', error);   
        })
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                Start Vacation Days <input onChange={this.setVacationStartDays} type="number" />
                Start Sick Days<input onChange={this.setSickStartDays} type="number" />
                End Vacation Days<input type="text" readOnly />
                End Sick Days<input type="text" value="" readOnly />
                <br></br>
                Start Date<input onChange={this.setStartDate} type="date" />
                End Date<input onChange={this.setEndDate} type="date" />
                Years At LRC <input onChange={this.setYears} type="number" />
                <button onClick={this.submitData}>Submit</button>
                <br></br>
                
                <br></br>
                {JSON.stringify(this.state)}
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(TestCronPage);