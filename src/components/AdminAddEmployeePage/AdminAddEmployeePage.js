import React, { Component } from 'react';
import { connect } from 'react-redux'
import moment from 'moment';

class AdminAddEmployeePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            start_date: ''
        };
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    }

    submit = (event) => {
        event.preventDefault();

        const startDate = this.state.start_date;
        const startMoment = moment(`${startDate} +0000`, 'YYYY-MM-DD Z').utc();
        const action = {
            type: 'ADD_EMPLOYEE',
            payload: {
                ...this.state,
                start_date: startMoment.format()
            }
        };
        this.props.dispatch(action);
        this.props.history.push('/admin/manage_employees');
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                <h2>Add Employee</h2>
                <form onSubmit={this.submit}>
                    <label htmlFor="first_name">First Name:</label>
                    <br />
                    <input onChange={this.handleChange} name="first_name" type="text" />
                    <br />
                    <label htmlFor="last_name">Last Name:</label>
                    <br />
                    <input onChange={this.handleChange} name="last_name" type="text" />
                    <br />
                    <label htmlFor="last_name">Email:</label>
                    <br />
                    <input onChange={this.handleChange} name="email" type="text" />
                    <br />
                    <label htmlFor="last_name">Start Date:</label>
                    <br />
                    <input onChange={this.handleChange} name="start_date" type="date" />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default connect()(AdminAddEmployeePage);