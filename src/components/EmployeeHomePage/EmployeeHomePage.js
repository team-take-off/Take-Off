import React, { Component } from 'react';
import { connect } from 'react-redux';
class EmployeeHomePage extends Component {
    
    // Show this component on the DOM
    render() {
        return (
            <div>
                {JSON.stringify(this.props.user.first_name)}
                <h1>Welcome, {this.props.user.first_name}</h1>
                <p>[ EmployeeHomePage ]</p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeHomePage);