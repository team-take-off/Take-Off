import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestForm from '../RequestForm/RequestForm';

class SickRequestPage extends Component {

    componentDidMount() {
        const action = { type: 'SET_USER_INFO', payload: this.props.reduxStore.user }
        this.props.dispatch(action)
    }


    render() {
        return (
            <div>
                <h2>Sick and Safe Time: {(parseFloat(this.props.reduxStore.userInfo.sick_hours) / 8)} Days</h2>
                <RequestForm history={this.props.history} type={2} />
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(SickRequestPage);