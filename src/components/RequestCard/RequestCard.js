import React, { Component } from 'react';
import { connect } from 'react-redux';

import DateRange from '../../modules/DateRange';

// TODO: Remove or replace eventually
const tempStyle = {
    backgroundColor: '#ddd'
};

class RequestCard extends Component {

    // Display the employee's name if possible
    renderName = () => {
        const requestArray = this.props.requestArray;
        if (requestArray.length === 0) {
            return '[Unknown Name]';
        } else {
            return `${requestArray[0].first_name} ${requestArray[0].last_name}`;
        }
    }

    // Show a nicely formatted date range if possible
    renderDateRange = () => {
        const requestArray = this.props.requestArray;
        if (requestArray.length === 0) {
            return '[Unknown Date Range]';
        }

        const dateRange = new DateRange(this.props.requestArray);
        return dateRange.format('LL');
    }

    // Show the type of request 'Vacation' or 'Sick and Safe Leave' if possible
    renderType = () => {
        const requestArray = this.props.requestArray;
        if (requestArray.length === 0) {
            return '[Unknown Type]';
        } else {
            return requestArray[0].type;
        }
    }

    // Renders an unordered list of conflicts with this request. Only applies if
    //  an array of conflicts was  sent via props.
    renderConflicts = () => {
        if (this.props.conflicts && this.props.conflicts.length > 0) {
            return (
                <div>
                    <h5>Conflicts:</h5>
                    <ul>
                        {this.props.conflicts.map(
                            (conflict, index) => {
                                const name = conflict.name;
                                const dateRange = new DateRange(conflict.dates);
                                const approved = conflict.approved ? '(Approved)' : '(Pending)';
                                return (<li key={index}>{name} - {dateRange.format('LL')} - {approved}</li>);
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
            if (this.props.requestArray.length > 0 && this.props.requestArray[0].status === 'pending') {
                return (
                    <div>
                        <button onClick={this.approve}>
                            Approve
                        </button>
                        <button onClick={this.deny}>
                            Deny
                        </button>
                    </div>
                );
            } else {
                return (
                    <button onClick={this.cancel}>
                        Cancel Request
                    </button>
                );
            } 
        }
    }

    // Renders a cancel/withdraw button allowing employees to withdraw a 
    // previous request that is still in the future.
    renderEmployeeButtons = () => {
        if (!this.props.forAdmin && !this.props.past) {
            return (
                <button onClick={this.withdraw}>
                    Cancel Request
                </button>
            );
        }
    }

    // Handles when the admin presses the 'Approve' button
    approve = () => {
        if (this.props.requestArray.length !== 0) {
            const id = this.props.requestArray[0].batch_of_requests_id;
            const action = {
                type: 'APPROVE_REQUEST',
                payload: id
            };
            this.props.dispatch(action);
        }
    }

    // Handles when the admin presses the 'Deny' button
    deny = () => {
        if (this.props.requestArray.length !== 0) {
            const id = this.props.requestArray[0].batch_of_requests_id;
            const action = {
                type: 'DENY_REQUEST',
                payload: id
            };
            this.props.dispatch(action);
        }
    }

    // Handles when the admin presses the 'Cancel' button.
    cancel = () => {
        if (this.props.requestArray.length !== 0) {
            const id = this.props.requestArray[0].batch_of_requests_id;
            const action = {
                type: 'DENY_REQUEST',
                payload: id
            };
            this.props.dispatch(action);
        }
    }

    // Handles when an employee presses the 'Withdraw' button (labeled cancel).
    withdraw = () => {
        if (this.props.requestArray.length !== 0) {
            const id = this.props.requestArray[0].batch_of_requests_id;
            const action = {
                type: 'WITHDRAW_USER_REQUEST',
                payload: id
            };
            this.props.dispatch(action);
        }
    }

    // Show this component on the DOM
    render() {
        return (
            <div style={tempStyle}>
                <h4>{this.renderName()} - {this.renderDateRange()}</h4>
                <h5>{this.renderType()}</h5>
                {this.renderConflicts()}
                {this.renderAdminButtons()}
                {this.renderEmployeeButtons()}
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(RequestCard);