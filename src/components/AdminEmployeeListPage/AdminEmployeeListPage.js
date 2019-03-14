import React, { Component } from 'react';
import { connect } from 'react-redux';

import EmployeeListRow from './EmployeeListRow/EmployeeListRow';

class AdminEmployeeListPage extends Component {

    // When this component mounts get all employees from the database
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' })
    }

    // Navigate to the page AdminAddEmployeePage
    addEmployee = () => {
        this.props.history.push('/admin/add_employee');
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <h2>Manage Employees</h2>
                <button onClick={this.addEmployee}>
                    Add New Employee
                </button>
                <h2>List Employees</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Start Date</th>
                            <th>Vacation Days</th>
                            <th>Sick and Safe Days</th>
                            <th>Edit</th>
                            <th>Deactivate</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.reduxStore.employees.map((employee, i) =>
                            <EmployeeListRow key={i} employee={employee} />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(AdminEmployeeListPage);