import React, { Component } from 'react';
import { connect } from 'react-redux';

import './AdminEmployeeListPage.css';
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
            <div className="page-container">
                <h2>Manage Employees</h2>
                <button onClick={this.addEmployee}>
                    Add New Employee
                </button>
                <div className="employee-list-wrapper">
                    <div className="employee-list-div">
                        <h2>List Employees</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Start Date</th>
                                    <th>Vacation</th>
                                    <th>Sick & Safe</th>
                                    <th>Edit</th>
                                    <th>Active</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.reduxStore.employees.map((employee, i) =>
                                    <EmployeeListRow key={i} employee={employee} history={this.props.history} />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});

export default connect(mapReduxStoreToProps)(AdminEmployeeListPage);