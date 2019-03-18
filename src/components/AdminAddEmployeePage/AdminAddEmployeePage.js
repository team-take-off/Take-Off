import React, { Component } from 'react';
import { connect } from 'react-redux'

class AdminAddEmployeePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            username: '',
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
        console.log(this.state);
        event.preventDefault();
        const action = {
            type: 'ADD_EMPLOYEE',
            payload: this.state
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                <h2>Add Employee</h2>
                <form onSubmit={this.submit}>
                    <input onChange={this.handleChange} name="first_name" placeholder="First Name" type="text" />
                    <input onChange={this.handleChange} name="last_name" placeholder="Last Name" type="text" />
                    <input onChange={this.handleChange} name="username" placeholder="username" type="text" />
                    <input onChange={this.handleChange} name="start_date" type="date" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default connect()(AdminAddEmployeePage);