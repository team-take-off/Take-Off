import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestForm from '../RequestForm/RequestForm';

class VacationRequestPage extends Component {

    componentDidMount() {
        const action = { type: 'SET_USER_INFO', payload: this.props.reduxStore.user }
        this.props.dispatch(action)
    }


    render() {
        return (
            <div>
                <h2>Vacation Time: {(parseFloat(this.props.reduxStore.userInfo.vacation_hours) / 8)} Days</h2>
                <RequestForm type={1} />
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(VacationRequestPage);