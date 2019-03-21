import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment-business-days';

class TestCronPage extends Component {
    constructor(props){
        super(props)
        this.state={
            Years:'',
            StartDate: '',
            EndDate: '',
            vacationStartDays: '',
            vacationEndDays: '',
            sickStartDays: '',
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
            StartDate: event.target.value
        });
    }

    setEndDate = (event) => {
        this.setState({
            ...this.state,
            EndDate: event.target.value
        });
    }

    

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                Start Vacation Days <input onChange={this.setVacationStartDays} type="number" />
                Start Sick Days<input onChange={this.setSickStartDays} type="number" />
                Years At LRC <input onChange={this.setYears} type="number"/>
                <br></br>
                Start Date<input onChange={this.setStartDate} type="date"/>
                End Date<input onChange={this.setEndDate} type="date" />
                <br></br>
                End Vacation Days<input type="text" readOnly/>
                End Sick Days<input type="text" value="" readOnly />
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