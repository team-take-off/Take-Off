import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class AdminSearchEmployeePage extends Component {
    constructor() {
        super()
        this.state = {
            firstname: '',
            year:'',
        }
    }
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' });
        this.props.dispatch({ type: 'FETCH_REQUESTS' });
    }

    setPerson = (event) => {
        this.setState({
            firstname: event.target.value
        })
    }
    setYear = (event) => {
        this.setState({
            year: event.target.value
        })
    }

    // Show this component on the DOM
    render() {
        let uniqueDates = [];
        for (let request of this.props.reduxStore.requests) {
           uniqueDates.push(request.date.substr(0, 4))
        }
        let requestDates = [...new Set(uniqueDates)];
        let userRequests = [];
        if(this.state.person !== '' && this.state.year !== ''){
        
        for (let request of this.props.reduxStore.requests) {
            if (request.first_name === this.state.firstname && request.date.substr(0, 4) === this.state.year) {
                userRequests.push(request)
            }
        }
    }

        return (
                <div className="page-container">
                    <select onChange={this.setPerson}>
                        <option value="" disabled selected>Select an Employee</option>

                        {this.props.reduxStore.employees.map((employee) => {
                            return <option value={employee.first_name}>{employee.first_name} {employee.last_name}</option>
                        })}

                    </select>
                    <select onChange={this.setYear}>
                        <option value="" disabled selected>Select a Year</option>
                        {requestDates.map((request) => {
                            return <option>{request}</option>
                        })}
                    </select>
                <RequestExpanderCollection requests={userRequests} forAdmin={true} />
                </div>
            );


    }
}
const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(AdminSearchEmployeePage);