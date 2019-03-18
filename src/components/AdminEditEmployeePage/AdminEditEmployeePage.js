import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class AdminEditEmployeePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            start_date: '',
            vacation_hours: '',
            sick_hours: ''
        };
        this.loadEmployeeState();
    }

    // As soon as this component mounts request all employee data from the 
    // server
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' });
    }

    // If any of the input data changes reload the selected employee data that 
    // is loaded into the form.
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.reduxStore.employees !== this.props.reduxStore.employees || prevProps.match.params.id !== this.props.match.params.id) {
            this.loadEmployeeState();
        }
    }

    // Load data for the current employee into this component's state
    loadEmployeeState = () => {
        const id = parseInt(this.props.match.params.id);
        let employee = null;
        for (let emp of this.props.reduxStore.employees) {
            if (emp.id === id) {
                employee = emp;
                break;
            }
        }
        if (employee) {
            this.setState({
                id: id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                username: employee.username,
                email: employee.email,
                start_date: moment(employee.start_date).format('YYYY-MM-DD'),
                vacation_hours: employee.vacation_hours,
                sick_hours: employee.sick_hours
            });
        }
    }

    // Handle a change to any of the input fields
    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    // Update the employee's data from state
    submit = (event) => {
        event.preventDefault();
        const action = {
            type: 'UPDATE_EMPLOYEE',
            payload: this.state
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                <h2>Edit Employee</h2>
                <form onSubmit={this.submit}>
                    <label htmlFor="first_name">First Name:</label>
                    <input onChange={this.handleChange} name="first_name" value={this.state.first_name} type="text" />
                    <br />
                    <label htmlFor="last_name">Last Name:</label>
                    <input onChange={this.handleChange} name="last_name" value={this.state.last_name} type="text" />
                    <br />
                    <label htmlFor="username">Username:</label>
                    <input onChange={this.handleChange} name="username" value={this.state.username} type="text" />
                    <br />
                    <label htmlFor="email">Email:</label>
                    <input onChange={this.handleChange} name="email" value={this.state.email} type="text" />
                    <br />
                    <label htmlFor="start_date">Start Date:</label>
                    <input onChange={this.handleChange} name="start_date" value={this.state.start_date} type="date" />
                    <br />
                    <label htmlFor="vacation_hours">Vacation (hours):</label>
                    <input onChange={this.handleChange} name="vacation_hours" value={this.state.vacation_hours} type="number" />
                    <br />
                    <label htmlFor="sick_hours">Sick & Safe (hours):</label>
                    <input onChange={this.handleChange} name="sick_hours" value={this.state.sick_hours} type="number" />
                    <br />
                    <input type="submit" />
                </form>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(AdminEditEmployeePage);