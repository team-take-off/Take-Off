import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import './AdminEditRequestsPage.css';

class AdminEditRequestsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            first_name: '',
            last_name: '',

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
                first_name: employee.first_name,
                last_name: employee.last_name
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
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.requests.map(request =>
                                <tr key={request.id} className="request-row">
                                    <td>{request.type}</td>
                                    <td>{request.startDate.format('LL')}</td>
                                    <td>{request.endDate.format('LL')}</td>
                                    <td>({request.status})</td>
                                    <td>
                                        <IconButton onClick={this.edit} aria-label="Delete">
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <form className="request-form">
                    <table>
                        <tr>
                            <td>
                                <label htmlFor="leave_type">Leave Type:</label>
                            </td>
                            <td>
                                <select name="leave_type" value="">
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
                                    min={moment().subtract(7, 'days').format('YYYY-MM-DD')}
                                    value=""
                                />
                                <select onChange={this.setStartDayType} value="">
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
                                    min={moment().subtract(7, 'days').format('YYYY-MM-DD')}
                                    value=""
                                />
                                <select onChange={this.setEndDayType} value="">
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
                                <select onChange={this.setStatus} value="">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="denied">Denied</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input type="submit" value="Add Request" />
                            </td>
                        </tr>
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