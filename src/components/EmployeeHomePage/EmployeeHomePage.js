import React, { Component } from 'react';
import { connect } from 'react-redux';

import './EmployeeHomePage.css';
import Nav from '../Nav/Nav';
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
            <>
                <Nav history={this.props.history} />
                <center><div className="page-container">
                    {this.props.reduxStore.user && (
                        <div className="employee-home-div">
                            <h1>Welcome, {this.props.reduxStore.user.first_name}</h1>
                            <VacationDaysHeading days={(parseFloat(this.props.reduxStore.user.vacation_hours) / 8)} />
                            <button onClick={this.vacationRequest} className="request-vacation" >Request Vacation</button>
                            <SickDaysHeading days={(parseFloat(this.props.reduxStore.user.sick_hours) / 8)} />
                            <button onClick={this.sickRequest} className="request-sick">Request Sick & Safe</button>
                        </div>
                    )}
                </div></center>
            </>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeHomePage);