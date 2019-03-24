import React, { Component } from 'react';
import { connect } from 'react-redux';

import './EmployeeHomePage.css';
import SickDaysHeading from '../SickDaysHeading/SickDaysHeading';
import VacationDaysHeading from '../VacationDaysHeading/VacationDaysHeading';

class EmployeeHomePage extends Component {
    componentDidMount() {
        // this.addUserInfo();
        this.props.dispatch({type: 'FETCH_USER_INFO'});
        
        if (this.props.reduxStore.user.role_id === 1 && this.props.reduxStore.adminMode) {
            this.props.history.push('/admin/home');
        }
    }

vacationRequest = (event) =>{
    this.props.history.push('/request_vacation')
}

sickRequest = (event) => {
    this.props.history.push('/request_sick') 
}
    // Show this component on the DOM
    render() {
        return (
            <center><div className="page-container">
                {this.props.reduxStore.userInfo && this.props.reduxStore.userInfo.length > 0 && (
                    <div className="employee-home-div">
                        <h1>Welcome, {this.props.reduxStore.userInfo[0].first_name}</h1>
                        <VacationDaysHeading days={(parseFloat(this.props.reduxStore.userInfo[0].vacation_hours) / 8)} />
                        <button onClick={this.vacationRequest} className="request-vacation" >Request Vacation</button>
                        <SickDaysHeading days={(parseFloat(this.props.reduxStore.userInfo[0].sick_hours) / 8)} />
                        <button onClick={this.sickRequest} className="request-sick">Request Sick and Safe</button>
                    </div>
                )}
            </div></center>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeHomePage);