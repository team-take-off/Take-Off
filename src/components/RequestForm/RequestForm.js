import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestFormRow from './RequestFormRow/RequestFormRow';

class RequestForm extends Component {

    appendRequestDate = () => {
        this.props.dispatch({ type: 'APPEND_VACATION_REQUEST' });
    }

    submit = (event) => {
        event.preventDefault();
        if (this.props.type === 1) {
            const action = {
                type: 'ADD_USER_REQUEST',
                payload: {
                    typeID: 1,
                    requestedDates: this.props.reduxStore.vacationRequestDates
                }
            };
            this.props.dispatch(action);
        } else {
            const action = {
                type: 'ADD_USER_REQUEST',
                payload: {
                    typeID: 2,
                    requestedDates: this.props.reduxStore.sickRequestDates
                }
            };
            this.props.dispatch(action);
        }
    }

    // Show this component on the DOM
    render() {
        return (
            <form onSubmit={this.submit}>
                {this.props.reduxStore.vacationRequestDates.map((request, i) =>
                    <RequestFormRow key={i} index={i} request={request} />
                )}
                <input onClick={this.appendRequestDate} type="button" value="+" />
                <input type="submit" />
            </form>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RequestForm);