import React, { Component } from 'react';

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
        console.log(this.state);
    }

    submit = (event) => {
        event.preventDefault();
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <h2>Add Employee</h2>
                <form onSubmit={this.submit}>
                    <input onChange={this.handleChange} name="first_name" placeholder="First Name" type="text" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default AdminAddEmployeePage;