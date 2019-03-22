import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import swal from 'sweetalert';
import moment from 'moment';

import './EmployeeListRow.css';

class EmployeeListRow extends Component {
    constructor(props){
        super(props);
        this.state = {
            clicked: false
        }
    }

    // Convert hours to nicely formatted representation of days
    // Note: Based on an 8 hour workday
    displayHoursAsDays = (hours) => {
        return (hours / 8.0).toFixed(1);
    }

    // Add one day of vacation to this rows's employee
    addVacation = () => {
        console.log('In EmployeeListRow pressed addVacation()');
        const emp_id = this.props.employee.id;
        this.props.dispatch({type: 'ADD_LEAVE_DAY', payload: {id: emp_id, leaveType: 'vacation'}});
    }

    // Add one day of sick and safe leave to this rows's employee
    addSick = () => {
        console.log('In EmployeeListRow pressed addSick()');
        const emp_id = this.props.employee.id;
        this.props.dispatch({type: 'ADD_LEAVE_DAY', payload: {id: emp_id, leaveType: 'sick'}});
    }

    // Bring up a page for editing this row's employee data
    edit = () => {
        this.props.history.push(`/admin/edit_employee/${this.props.employee.id}`);
    }

    // Deactivate this row's employee
    deactivate = () => {
        swal({
                title: "Are you sure?",
                text: "Employee status will be changed!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {

                if (willDelete) {
                    if (this.props.employee.is_active) {
                        swal("Employee access revoked!", {
                            icon: "success",
                        });
                        const action = { type: 'DEACTIVATE_EMPLOYEE', payload: this.props.employee.id }
                        this.props.dispatch(action);
                    } else {
                        swal("Employee access restored!", {
                            icon: "success",
                        });
                        const action = { type: 'ACTIVATE_EMPLOYEE', payload: this.props.employee.id }
                        this.props.dispatch(action);
                    }
                } else {
                    swal("Employee Still has Access");
                }
            });
        
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

    showButton = () => {
        this.setState({
            clicked: !(this.state.clicked),
        })
    }

    // Show this component on the DOM
    render() {
        const employee = this.props.employee;
        return (
            <tr className="employee-row">
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.email}</td>
                <td>{moment(employee.start_date).format('MMM DD, YYYY')}</td>
                <td>{this.displayHoursAsDays(employee.vacation_hours)} <button onClick={this.addVacation}>+</button></td>
                <td>
                    {this.displayHoursAsDays(employee.sick_hours)}
                    <button onClick={this.addSick}>+</button>
                </td>
                <td>
                    <IconButton onClick={this.edit} aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                </td>

                <td><button onClick={this.deactivate}>{employee.is_active ? 'Deactivate' : 'Activate'}</button></td>
                <td>
                    <IconButton onClick={this.delete} aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </td>
            </tr>
        );
    }
}

export default withRouter(connect()(EmployeeListRow));