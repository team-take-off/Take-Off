import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';

class EmployeeHomePage extends Component {
    constructor(){
        super()
        this.state={
            sick_time:'',
            vacation:'',
        }
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
                {/* {JSON.stringify(this.props.user)} */}
                <h1>Welcome, {this.props.user.first_name}</h1>
                <h2>Vacation Time: {this.props.user.vacation_hours}</h2>
                <button onClick={this.vacationRequest}>Request Vacation</button>
                <h2>Sick and Safe Time: {this.props.user.sick_hours}</h2>
                <button onClick={this.sickRequest}>Request Sick and Safe</button>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeHomePage);