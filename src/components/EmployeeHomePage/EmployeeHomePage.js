import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';

class EmployeeHomePage extends Component {
    constructor(){
        super()
    }
    componentDidMount() {
        // this.addUserInfo();
        this.props.dispatch({type: 'FETCH_USER_INFO'});
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
            <div>
                {JSON.stringify(this.props.reduxStore.userInfo)}
                {this.props.reduxStore.userInfo && this.props.reduxStore.userInfo.length > 0 && (
                    <div>
                        <h1>Welcome, {this.props.reduxStore.userInfo[0].first_name}</h1>
                <h2>Vacation Time: {(parseFloat(this.props.reduxStore.userInfo[0].vacation_hours) / 8)} Days</h2>
                <button onClick={this.vacationRequest}>Request Vacation</button>
                <h2>Sick and Safe Time: {(parseFloat(this.props.reduxStore.userInfo[0].sick_hours) / 8)} Days</h2>
                <button onClick={this.sickRequest}>Request Sick and Safe</button>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeHomePage);