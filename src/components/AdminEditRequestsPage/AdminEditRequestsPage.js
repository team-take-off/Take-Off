import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import './AdminEditRequestsPage.css';

const HOURS_PER_DAY = 8.0;

class AdminEditRequestsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            first_name: '',
            last_name: '',
            start_date: '',
            vacation_hours: '',
            sick_hours: '',

            requestsRaw: undefined,
            requests: []
        };
    }

    // As soon as this component mounts request all employee data from the 
    // server
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' });
        this.props.dispatch({ type: 'FETCH_REQUESTS', payload: { employee: this.props.match.params.id } })
    }

    // If any of the input data changes reload the selected employee data that 
    // is loaded into the form.
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.employees !== this.props.employees || prevProps.match.params.id !== this.props.match.params.id) {
            this.loadEmployeeState();
        }
        if (prevProps.requestsRaw !== this.props.requestsRaw) {
            this.setState({
                ...this.state,
                requests: [
                    ...this.props.requestsRaw.past,
                    ...this.props.requestsRaw.denied,
                    ...this.props.requestsRaw.pending,
                    ...this.props.requestsRaw.approved
                ]
            });
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
                <h2>Edit Employee Requests</h2>
                <h3>{this.state.first_name} {this.state.last_name}</h3>
                <div className="request-history-pane">
                    <table>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.requests.map(request =>
                                <tr key={request.id}>
                                    <td>{request.type}</td>
                                    <td>{request.startDate.format('LL')}</td>
                                    <td>{request.endDate.format('LL')}</td>
                                    <td>({request.status})</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    employees: reduxStore.employees,
    requestsRaw: reduxStore.requests
});

export default connect(mapStateToProps)(AdminEditRequestsPage);