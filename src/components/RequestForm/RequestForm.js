import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestFormRow from './RequestFormRow/RequestFormRow';
const moment = require('moment-business-days');
moment().format();

class RequestForm extends Component {

    appendRequestDate = () => {
        if(this.props.type ===1){
        this.props.dispatch({ type: 'APPEND_VACATION_REQUEST',});
        }
        else{
            this.props.dispatch({ type: 'APPEND_SICK_REQUEST' });
        }
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
            const action2 = {
                type: 'RESET_VACATION_REQUEST'
            }
            this.props.dispatch(action);
            this.props.dispatch(action2);
            this.props.history.push('/home');
        } else {
            const action = {
                type: 'ADD_USER_REQUEST',
                payload: {
                    typeID: 2,
                    requestedDates: this.props.reduxStore.sickRequestDates
                }
            };
           const action2 = {
                type: 'RESET_SICK_REQUEST'
            }
            this.props.dispatch(action);
            this.props.dispatch(action2);
            this.props.history.push('/home');
        }
    }

    // Show this component on the DOM
    render() {
        let type;
        if(this.props.type===1){
            type = 
                this.props.reduxStore.vacationRequestDates.map((request, i) =>
                    <RequestFormRow type={this.props.type} key={i} index={i} request={request} />
                ) 
        }else{
            type = this.props.reduxStore.sickRequestDates.map((request, i) =>
                <RequestFormRow type={this.props.type} key={i} index={i} request={request} />
            )
        }
        return (
            <form onSubmit={this.submit}>
                            {type}
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
