import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class AdminSearchEmployeePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: '',
            year: ''
        }
    }

    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' });
        this.props.dispatch({ type: 'FETCH_REQUESTS' });
    }

    setEmployee = (event) => {
        console.log(event.target.value);
        const nextState = {
            ...this.state,
            employee: event.target.value
        };
        this.setState(nextState);
        this.props.dispatch({ type: 'FETCH_REQUESTS', payload: nextState });
    }

    setYear = (event) => {
        const nextState = {
            ...this.state,
            year: event.target.value
        }
        this.setState(nextState);
        this.props.dispatch({ type: 'FETCH_REQUESTS', payload: nextState });
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                <select onChange={this.setEmployee} defaultValue="">
                    <option value="" disabled>Select an Employee</option>
                    {this.props.reduxStore.employees.map((employee) => {
                        return <option key={employee.id} value={employee.id}>{employee.first_name} {employee.last_name}</option>
                    })}
                </select>
                <select onChange={this.setYear} defaultValue="">
                    <option value="" disabled>Select a Year</option>
                    {this.props.reduxStore.requests.years.map((year) => {
                        return <option key={year}>{year}</option>
                    })}
                </select>
                <RequestExpanderCollection
                    pending={this.props.reduxStore.requests.pending}
                    approved={this.props.reduxStore.requests.approved}
                    denied={this.props.reduxStore.requests.denied}
                    past={this.props.reduxStore.requests.past}
                    forAdmin={true}
                />
            </div>
        );
    }
}
const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(AdminSearchEmployeePage);