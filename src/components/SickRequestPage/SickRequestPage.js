import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../Nav/Nav';
import RequestForm from '../RequestForm/RequestForm';
import SickDaysHeading from '../SickDaysHeading/SickDaysHeading';

class SickRequestPage extends Component {

    render() {
        return (
            <>
                <Nav history={this.props.history} />
                <div className="page-container">
                    {this.props.reduxStore.user && (
                        <div>
                            <SickDaysHeading days={(parseFloat(this.props.reduxStore.user.sick_hours) / 8)} />
                            <RequestForm history={this.props.history} type={this.props.reduxStore.enteredSickRequest} typeid={2}/>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(SickRequestPage);