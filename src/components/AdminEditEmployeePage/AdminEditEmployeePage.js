import React, { Component } from 'react';
import { connect } from 'react-redux';

class AdminEditEmployeePage extends Component {


    // Show this component on the DOM
    render() {
        const id = this.props.match.params.id;
        return (
            <div>
                <h2>Edit Employee: {id}</h2>
                
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(AdminEditEmployeePage);