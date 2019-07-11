import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestForm from '../RequestForm/RequestForm';
import VacationDaysHeading from '../VacationDaysHeading/VacationDaysHeading';

class VacationRequestPage extends Component {

    render() {
        return (
            <div className="page-container">
                {this.props.reduxStore.user && (
                    <div>
                        <VacationDaysHeading days={(parseFloat(this.props.reduxStore.user.vacation_hours) / 8)} />
                        <RequestForm history={this.props.history} type={this.props.reduxStore.enteredVacationRequest} typeid={1} />
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
export default connect(mapStateToProps)(VacationRequestPage);