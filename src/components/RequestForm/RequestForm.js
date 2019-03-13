import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestFormRow from './RequestFormRow/RequestFormRow';

class RequestForm extends Component {

    appendRequestDate = () => {
        this.props.dispatch({ type: 'APPEND_VACATION_REQUEST' });
    }

    submit = (event) => {
        event.preventDefault();
        console.log('-- in RequestForm submit()');
    }

    // Show this component on the DOM
    render() {
        return (
            <form onSubmit={this.submit}>
                {this.props.reduxStore.vacationRequestDates.map((date, i) => 
                    <RequestFormRow key={i} />
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