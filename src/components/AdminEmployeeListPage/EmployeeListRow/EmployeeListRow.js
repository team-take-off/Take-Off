import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';

class EmployeeListRow extends Component {

    // Convert hours to nicely formatted representation of days
    // Note: Based on an 8 hour workday
    displayHoursAsDays = (hours) => {
        return (hours / 8.0).toFixed(1);
    }

    // Add one day of vacation to this rows's employee
    addVacation = () => {
        console.log('In EmployeeListRow pressed addVacation()');
        // this.props.dispatch();
    }

    // Add one day of sick and safe leave to this rows's employee
    addSick = () => {
        console.log('In EmployeeListRow pressed addSick()');
        // this.props.dispatch();
    }

    // Bring up a page for editing this row's employee data
    edit = () => {
        console.log('In EmployeeListRow pressed edit()');
    }

    // Deactivate this row's employee
    deactivate = () => {
        console.log('In EmployeeListRow pressed deactivate()');
    }

    // Delete this row's employee
    delete = () => {
        swal({
                title: "Are you sure?",
                text: "Once deleted, employee and employee record is deleted!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Employee Deleted!", {
                        icon: "success",
                        });
                        console.log('id fir the dlete row: ', this.props.employee.id);
                        const action = {type: 'DELETE_EMPLOYEE', payload: this.props.employee.id}
                        this.props.dispatch(action);
                    } else {
                        swal("Employee Record Safe");
                    }
                });
    }

    // Show this component on the DOM
    render() {
        const employee = this.props.employee;
        return (
            
            
            <tr>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.username}</td>
                <td>{employee.start_date}</td>
                <td>{this.displayHoursAsDays(employee.vacation_hours)} <button onClick={this.addVacation}>+</button></td>
                <td>{this.displayHoursAsDays(employee.sick_hours)} <button onClick={this.addSick}>+</button></td>
                <td><button onClick={this.edit}>Edit</button></td>
                <td><button onClick={this.deactivate}>Deactivate</button></td>
                <td><button onClick={this.delete}>Delete</button></td>
            </tr>
        );
    }
}

export default connect()(EmployeeListRow);