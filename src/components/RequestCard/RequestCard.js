import React, { Component } from 'react';
import { connect } from 'react-redux';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import PropTypes from 'prop-types';

import './RequestCard.css';
import DateRange from '../../classes/DateRange';
// import EditDialog from './EditDialog';
import Request from '../../classes/Request';
import RequestUnit from '../../classes/RequestUnit';

class RequestCard extends Component {

    state = {
        editDialog: false,
    }

    // Display the employee's name if possible
    renderName = () => {
        const request = this.props.request;
        if (request.employee.firstName && request.employee.lastName) {
            return `${request.employee.firstName} ${request.employee.lastName}`;
        } else {
            return '[Unknown Name]';
        }
    }

    // Show a nicely formatted date range if possible
    renderDateRange = () => {
        const request = this.props.request;
        if (request.units.length === 0) {
            return '[Unknown Date Range]';
        }

        const dateRange = new DateRange(request.units);
        return dateRange.format('LL');
    }

    // Show the type of request 'Vacation' or 'Sick and Safe Leave' if possible
    renderType = () => {
        const request = this.props.request;
        let blocks = '';
        for (let unit of request.units) {
            if (unit.dayType.description === 'fullday') {
                blocks += ' ◼';
            } else if (unit.dayType.description === 'morning') {
                blocks += ' ◩';
            } else if (unit.dayType.description === 'afternoon') {
                blocks += ' ◪';
            } else if (unit.dayType.description === 'blank') {
                blocks += ' □';
            }
        }

        return (<span className={request.getSpanClass()}>{request.formatType()}: {blocks}</span>);
    }

    // Renders an unordered list of conflicts with this request. Only applies if
    //  an array of conflicts was  sent via props.
    renderCollisions = () => {
        const collisions = this.props.request.collisions;
        if (collisions && collisions.length > 0) {
            return (
                <div>
                    <h4>Conflicts:</h4>
                    <ul>
                        {collisions.map(
                            (collision, index) => {
                                const firstName = collision.employee.firstName;
                                const lastName = collision.employee.lastName;
                                const collisionUnits = [new RequestUnit(1, collision.startDate, true, false, false, false), new RequestUnit(1, collision.endDate, true, false, false, false)];
                                const dateRange = new DateRange(collisionUnits);
                                const status = collision.formatStatus();
                                return (<li key={index}>{firstName} {lastName} - {dateRange.format('LL')} - {status}</li>);
                            }
                        )}
                    </ul>
                </div>
            );
        }
    }

    // Render 'Approve' and 'Deny' buttons on pending cards shown to the admin.
    // Renders a cancel button on already approved cards.
    renderAdminButtons = () => {
        if (this.props.forAdmin && !this.props.past) {
            if (this.props.request.isPending()) {
                return (
                    <div className="request-card-buttons">
                        <button onClick={this.deny}>
                            <RemoveCircleIcon fontSize="small" /> Deny
                        </button>
                        <button onClick={this.approve} className="approve">
                            <CheckCircleIcon fontSize="small" /> Approve
                        </button>
                        {/* <button onClick={this.edit}>
                            Edit
                        </button> */}
                    </div>
                );
            }
        }
    }

    // Renders a cancel/withdraw button allowing employees to withdraw a 
    // previous request that is still in the future.
    renderEmployeeButtons = () => {
        if (!this.props.forAdmin && !this.props.past) {
            return (
                <div className="request-card-buttons">
                    <button onClick={this.withdraw}>
                        <RemoveCircleIcon fontSize="small" /> Withdraw Request
                    </button>
                </div>
            );
        }
    }

    // Handles when the admin presses the 'Approve' button
    approve = () => {
        const id = this.props.request.id;
        const action = {
            type: 'APPROVE_REQUEST',
            payload: id
        };
        this.props.dispatch(action);
    }

    // Handles when the admin presses the 'Deny' button
    deny = () => {
        const id = this.props.request.id;
        const action = {
            type: 'DENY_REQUEST',
            payload: id
        };
        this.props.dispatch(action);
    }

    // Handles when the admin presses the 'Edit' button
    edit = () => {
        if(this.props.requestArray.length) {
            this.setState({
                editDialog: true,
            });
        }
    }

    closeEdit = () => {
        this.setState({
            editDialog: false,
        });
    }

    // Handles when the admin presses the 'Cancel' button.
    cancel = () => {
        if (this.props.requestArray.length !== 0) {
            // const id = this.props.requestArray[0].batch_of_requests_id;
            const id = this.props.request.id;
            const action = {
                type: 'WITHDRAW_USER_REQUEST',
                payload: {
                    id,
                    user: this.props.reduxStore.user.id
                }
            };
            this.props.dispatch(action);
        }
    }

    // Handles when an employee presses the 'Withdraw' button (labeled cancel).
    withdraw = () => {
        // const id = this.props.requestArray[0].batch_of_requests_id;
        const id = this.props.request.id;
        const action = {
            type: 'WITHDRAW_USER_REQUEST',
            payload: {
                id,
                user: this.props.reduxStore.user.id
            }
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="request-card">
                <h4>{this.renderName()}</h4>
                <h5>{this.renderDateRange()}</h5>
                <h6>{this.renderType()}</h6>
                <div className="collisions">
                    {this.renderCollisions()}
                </div>
                {this.renderAdminButtons()}
                {this.renderEmployeeButtons()}
                {/* <EditDialog
                    open={this.state.editDialog}
                    closeEdit={this.closeEdit}
                    startingArray={this.props.request}
                /> */}
            </div>
        );
    }
}

RequestCard.propTypes = {
    request: PropTypes.instanceOf(Request).isRequired,
    forAdmin: PropTypes.bool.isRequired,
    past: PropTypes.bool.isRequired
};

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(RequestCard);