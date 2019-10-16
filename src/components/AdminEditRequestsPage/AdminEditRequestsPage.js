import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import DateRange from '../../classes/DateRange';
import './AdminEditRequestsPage.css';

const START_HOUR = 9;
const MIDDAY_HOUR = 13;
const END_HOUR = 17;

const getStartHour = (dayType) => {
    if (dayType === 'fullday' || dayType === 'morning') {
        return START_HOUR;
    } else if (dayType === 'afternoon') {
        return MIDDAY_HOUR;
    } else {
        return -1;
    }
}

const getEndHour = (dayType) => {
    if (dayType === 'fullday' || dayType === 'afternoon') {
        return END_HOUR;
    } else if (dayType === 'morning') {
        return MIDDAY_HOUR;
    } else {
        return -1;
    }
}

class AdminEditRequestsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            first_name: '',
            last_name: '',

            requestsRaw: undefined,
            requests: [],

            leaveType: '',
            startDate: '',
            startDayType: 'fullday',
            endDate: '',
            endDayType: 'fullday',
            status: ''
        };
    }

    // As soon as this component mounts request all employee data from the 
    // server
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_EMPLOYEES' });
        this.props.dispatch({ type: 'FETCH_REQUESTS', payload: { employee: this.props.match.params.id } });
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
                first_name: employee.first_name,
                last_name: employee.last_name
            });
        }
    }

    deleteRequest = (id) => {
        this.props.dispatch({
            type: 'DELETE_REQUEST',
            payload: id
        });
    }

    selectLeaveType = (event) => {
        this.setState({
            ...this.state,
            leaveType: event.target.value
        });
    }

    setStartDate = (event) => {
        const newDate = event.target.value;
        if (!this.state.endDate || moment(this.state.endDate).isBefore(moment(newDate))) {
            this.setState({
                ...this.state,
                startDate: newDate,
                endDate: newDate,
                endDayType: this.state.startDayType
            });
        } else {
            this.setState({
                ...this.state,
                startDate: newDate
            });
        }
    }

    setEndDate = (event) => {
        const newDate = event.target.value;
        if (!this.state.startDate || moment(this.state.startDate).isAfter(moment(newDate))) {
            this.setState({
                ...this.state,
                startDate: newDate,
                endDate: newDate,
                endDayType: this.state.startDayType
            });
        } else {
            this.setState({
                ...this.state,
                endDate: newDate
            });
        }
    }

    setStartDayType = (event) => {
        const newDayType = event.target.value;
        if (this.state.startDate === this.state.endDate) {
            this.setState({
                ...this.state,
                startDayType: newDayType,
                endDayType: newDayType
            });
        } else {
            this.setState({
                ...this.state,
                startDayType: newDayType,
            });
        }
    }

    setEndDayType = (event) => {
        const newDayType = event.target.value;
        if (this.state.startDate === this.state.endDate) {
            this.setState({
                ...this.state,
                startDayType: newDayType,
                endDayType: newDayType
            });
        } else {
            this.setState({
                ...this.state,
                endDayType: newDayType,
            });
        }
    }

    setStatus = (event) => {
        this.setState({
            ...this.state,
            status: event.target.value
        });
    }

    readyToSubmit = () => {
        if (this.state.leaveType 
            && this.state.startDate 
            && this.state.startDayType 
            && this.state.endDate 
            && this.state.endDayType 
            && this.state.status
        ) {
            return true;
        }
        return false;
    }

    submit = (event) => {
        event.preventDefault();
        if (this.readyToSubmit()) {
            const startHour = getStartHour(this.state.startDayType);
            const endHour = getEndHour(this.state.endDayType);
            const action = {
                type: 'ADD_REQUEST',
                payload: {
                    employee: this.state.id,
                    typeID: this.state.leaveType,
                    startDate: moment(this.state.startDate).set('hour', startHour),
                    endDate: moment(this.state.endDate).set('hour', endHour),
                    status: this.state.status
                }
            };
            console.log(action);
            this.props.dispatch(action);
            this.setState({
                ...this.state,
                leaveType: '',
                startDate: '',
                startDayType: 'fullday',
                endDate: '',
                endDayType: 'fullday',
                status: ''
            });
        }
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
                                <th>Leave Type</th>
                                <th>Date Range</th>
                                <th>Request Status</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.requests.map(request =>
                                <tr key={request.id} className="request-row">
                                    <td>{request.type === 'Vacation' ? 'Vacation' : 'Sick & Safe'}</td>
                                    <td>{(new DateRange(request.units)).format('LL')}</td>
                                    <td>{request.status}</td>
                                    <td>
                                        <IconButton onClick={this.deleteRequest.bind(this, request.id)} aria-label="Delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <form className="request-form" onSubmit={this.submit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="leave_type">Leave Type:</label>
                                </td>
                                <td>
                                    <select name="leave_type" onChange={this.selectLeaveType} value={this.state.leaveType}>
                                        <option disabled value="">-- select --</option>
                                        <option value="1">Vacation</option>
                                        <option value="2">Sick and Safe</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="start_date">Start Date:</label>
                                </td>
                                <td>
                                    <input
                                        onChange={this.setStartDate}
                                        name="start_date"
                                        type="date"
                                        value={this.state.startDate}
                                    />
                                    <select onChange={this.setStartDayType} value={this.state.startDayType}>
                                        <option value="fullday">Full Day</option>
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="end_date">End Date:</label>
                                </td>
                                <td>
                                    <input
                                        onChange={this.setEndDate}
                                        name="end_date"
                                        type="date"
                                        value={this.state.endDate}
                                    />
                                    <select onChange={this.setEndDayType} value={this.state.endDayType} disabled={this.state.startDate === this.state.endDate}>
                                        <option value="fullday">Full Day</option>
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="end_date">Status:</label>
                                </td>
                                <td>
                                    <select onChange={this.setStatus} value={this.state.status}>
                                        <option disabled value="">-- select --</option>
                                        <option value="1">Pending</option>
                                        <option value="2">Approved</option>
                                        <option value="3">Denied</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <input type="submit" value="Add Request" disabled={!this.readyToSubmit()} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    employees: reduxStore.employees,
    requestsRaw: reduxStore.requests
});

export default connect(mapStateToProps)(AdminEditRequestsPage);