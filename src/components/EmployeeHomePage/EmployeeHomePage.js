import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';

class EmployeeHomePage extends Component {
    componentDidMount() {
        this.addUserInfo();
    }
//     getEmployee = (event)=> {
//         axios({
//         method:'GET',
//         url:`/api/employee/userinfo:${this.props.user.id}`,
//     }).then((response)=>{
//         this.setState({
//             vacation:response.vacation,
//             sick_time:response.sick_time,
//         })
//     })
// }

    addUserInfo = (event) => {
        const action = { type: 'SET_USER_INFO', payload: this.props.reduxStore.user }
        this.props.dispatch(action)
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
                <h1>Welcome, {this.props.reduxStore.userInfo.first_name}</h1>
                <h2>Vacation Time: {(parseFloat(this.props.reduxStore.userInfo.vacation_hours) / 8)} Days</h2>
                <button onClick={this.vacationRequest}>Request Vacation</button>
                <h2>Sick and Safe Time: {(parseFloat(this.props.reduxStore.userInfo.sick_hours) / 8)} Days</h2>
                <button onClick={this.sickRequest}>Request Sick and Safe</button>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeHomePage);