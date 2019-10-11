import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const HOURS_PER_DAY = 8.0;

class AdminEditEmployeePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            start_date: '',
            vacation_hours: '',
            sick_hours: ''
        };
    }

    // As soon as this component mounts request all employee data from the 
    // server
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' });
    }

    // If any of the input data changes reload the selected employee data that 
    // is loaded into the form.
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.employees !== this.props.employees || prevProps.match.params.id !== this.props.match.params.id) {
            this.loadEmployeeState();
        }
    }

    // Load data for the current employee into this component's state
    loadEmployeeState = () => {
        const id = parseInt(this.props.match.params.id);
        let employee = null;
        for (let emp of this.props.employees) {
            if (emp.id === id) {
                employee = emp;
                break;
            }
        }
        if (employee) {
            this.setState({
                id: id,
                email: employee.email,
                first_name: employee.first_name,
                last_name: employee.last_name,
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

    // Special handler function for setting vacation hours based on changes to
    // vacation days
    handleChangeVacationDays = (event) => {
        this.setState({
            ...this.state,
            vacation_hours: event.target.value * HOURS_PER_DAY
        });
    }

    // Special handler function for setting sick hours based on changes to
    // sick days
    handleChangeSickDays = (event) => {
        this.setState({
            ...this.state,
            sick_hours: event.target.value * HOURS_PER_DAY
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
        this.props.history.push('/admin/manage_employees');
    }

    // Cancel using this form and navigate back to the employee list
    cancel = () => {
        this.props.history.push('/admin/manage_employees');
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                <h2>Edit Employee</h2>
                <form onSubmit={this.submit}>
                    <label htmlFor="first_name">First Name:</label>
                    <br />
                    <input onChange={this.handleChange} name="first_name" value={this.state.first_name} type="text" />
                    <br />
                    <label htmlFor="last_name">Last Name:</label>
                    <br />
                    <input onChange={this.handleChange} name="last_name" value={this.state.last_name} type="text" />
                    <br />
                    <label htmlFor="email">Email:</label>
                    <br />
                    <input onChange={this.handleChange} name="email" value={this.state.email} type="text" />
                    <br />
                    <label htmlFor="start_date">Start Date:</label>
                    <br />
                    <input onChange={this.handleChange} name="start_date" value={this.state.start_date} type="date" />
                    <br />
                    <label htmlFor="vacation_days">Vacation (days):</label>
                    <br />
                    <input onChange={this.handleChangeVacationDays} name="vacation_days" value={this.state.vacation_hours / 8.0} type="number" />
                    <br />
                    <label htmlFor="vacation_hours">Vacation (hours):</label>
                    <br />
                    <input onChange={this.handleChange} name="vacation_hours" value={this.state.vacation_hours} type="number" />
                    <br />
                    <label htmlFor="sick_days">Sick & Safe (days):</label>
                    <br />
                    <input onChange={this.handleChangeSickDays} name="sick_days" value={this.state.sick_hours / 8.0} type="number" />
                    <br />
                    <label htmlFor="sick_hours">Sick & Safe (hours):</label>
                    <br />
                    <input onChange={this.handleChange} name="sick_hours" value={this.state.sick_hours} type="number" />
                    <br />
                    <input type="submit" />
                    <input onClick={this.cancel} type="button" value="Cancel" />
                </form>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    employees: reduxStore.employees
});

export default connect(mapStateToProps)(AdminEditEmployeePage);