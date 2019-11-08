import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import swal from 'sweetalert';
import moment from 'moment';

import './EmployeeListRow.css';

const HOURS_PER_DAY = 8;

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
        return (hours / HOURS_PER_DAY).toFixed(1);
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

    // Show this component on the DOM
    render() {
        const employee = this.props.employee;
        const employeeStartMoment = moment(employee.start_date, 'YYYY-MM-DD').utc();
        return (
            <tr className={employee.is_active ? "employee-row" : "employee-row deactivated-row"}>
                <td>{employee.first_name} {employee.last_name}</td>
                <td>{employee.email}</td>
                <td>{employeeStartMoment.format('MMM DD, YYYY')}</td>
                <td>
                    {this.displayHoursAsDays(employee.vacation_hours)}
                </td>
                <td>
                    {this.displayHoursAsDays(employee.sick_hours)}
                </td>
                <td>
                    <IconButton onClick={this.edit} aria-label="Edit">
                        <EditIcon />
                    </IconButton>
                </td>

                <td><button onClick={this.deactivate}>{employee.is_active ? 'Deactivate' : 'Activate'}</button></td>
            </tr>
        );
    }
}

export default withRouter(connect()(EmployeeListRow));