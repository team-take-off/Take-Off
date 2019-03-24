import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestForm from '../RequestForm/RequestForm';
import SickDaysHeading from '../SickDaysHeading/SickDaysHeading';

class SickRequestPage extends Component {

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_USER_INFO'});
    }


    render() {
        return (
            <div className="page-container">
                {this.props.reduxStore.userInfo && this.props.reduxStore.userInfo.length > 0 && (
                    <div>
                        <SickDaysHeading days={(parseFloat(this.props.reduxStore.userInfo[0].sick_hours) / 8)} />
                        <RequestForm history={this.props.history} type={this.props.reduxStore.sickRequestDates} typeid={2}/>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(SickRequestPage);