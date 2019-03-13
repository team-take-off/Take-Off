import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestFormRow from './RequestFormRow/RequestFormRow';

class RequestForm extends Component {

    appendRequestDate = () => {
        this.props.dispatch({ type: 'APPEND_VACATION_REQUEST' });
    }

    submit = (event) => {
        event.preventDefault();
        console.log('---');
        for (let i = 0; i <  this.props.reduxStore.vacationRequestDates.length; i++) {
            if (this.props.reduxStore.vacationRequestDates[i] === '') {
                console.log(' - (not set)');
            } else {
                console.log(' - ', this.props.reduxStore.vacationRequestDates[i]);
            }
        }
        console.log('---');
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