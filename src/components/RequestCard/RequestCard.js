import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
// TODO: Remove or replace eventually
const tempStyle = {
    backgroundColor: '#ddd'
};

class RequestCard extends Component {

    renderName = () => {
        const requestArray = this.props.requestArray;
        if (requestArray.length === 0) {
            return '[Unknown Name]';
        } else {
            return `${requestArray[0].first_name} ${requestArray[0].last_name}`;
        }
    }

    renderDateRange = () => {
        const requestArray = this.props.requestArray;
        if (requestArray.length === 0) {
            return '[Unknown Date Range]';
        }

        // Read in an array of objects with the attribute 'date:' and convert
        // to an array of class 'moment' from Moment.js.
        let momentArray = [];
        for (let element of requestArray) {
            momentArray.push(moment(element.date, 'YYYY-MM-DD'));
        }

        // Sort the array of moments
        momentArray.sort((left, right) => {
            return left.diff(right);
        });

        // Build a human readable output string and condense all contiguous 
        // dates into date ranges such as 'April 1, 2019 to April 3, 2019'.
        let outputString = momentArray[0].format('LL');
        for (let i = 1; i < momentArray.length; i++) {
            if (i === momentArray.length - 1) {
                outputString += ` to ${momentArray[i].format('LL')}`;
            } else if (momentArray[i + 1].diff(momentArray[i], 'days') > 1) {
                outputString += ` to ${momentArray[i].format('LL')} and ${momentArray[i+1].format('LL')}`;
                i += 1;
            }
        }
        return outputString;
    }

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
                                const dateRanges = this.formatAsDateRange(conflict.dates);
                                const approved = conflict.approved ? '(Approved)' : '(Pending)';
                                return (<li key={index}>{name} - {dateRanges} - {approved}</li>);
                            }
                        )}
                    </ul>
                </div>
            );
        }
    }

    // Renders a 'Approve' button. Only applies if an 'onApprove' function was 
    // sent via props.
    renderApproveButton = () => {
        if (this.props.onApprove) {
            return (
                <button onClick={this.props.onApprove}>
                    Approve
                </button>
            );
        }
    }

    // Renders a 'Deny' button. Only applies if an 'onDeny' function was 
    // sent via props.
    renderDenyButton = () => {
        if (this.props.onDeny) {
            return (
                <button onClick={this.props.onDeny}>
                    Deny 
                </button>
            );
        }
    }

    // Renders a 'Cancel' button. Only applies if an 'onCancel' function was 
    // sent via props.
    renderCancelButton = () => {
        if (this.props.onCancel) {
            return (
                <button onClick={this.props.onCancel}>
                    Cancel Request
                </button>
            );
        }
    }

    // Show this component on the DOM
    render() {
        return (
            <div style={tempStyle}>
                <h4>{this.renderName()} - {this.renderDateRange()}</h4>
                <h5>{this.renderType()}</h5>
                {this.renderConflicts()}
                {this.renderApproveButton()}
                {this.renderDenyButton()}
                {this.renderCancelButton()}
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RequestCard);