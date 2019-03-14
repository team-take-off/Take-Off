import React, { Component } from 'react';
import { connect } from 'react-redux';

class AdminEditEmployeePage extends Component {

    // Show this component on the DOM
    render() {
        return (
            <div>
                <h2>Edit Employee</h2>
                
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(AdminEditEmployeePage);