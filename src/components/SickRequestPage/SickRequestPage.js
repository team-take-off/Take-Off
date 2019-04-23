import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestForm from '../RequestForm/RequestForm';
import SickDaysHeading from '../SickDaysHeading/SickDaysHeading';

class SickRequestPage extends Component {

    render() {
        return (
            <div className="page-container">
                {this.props.reduxStore.user && (
                    <div>
                        <SickDaysHeading days={(parseFloat(this.props.reduxStore.user.sick_hours) / 8)} />
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