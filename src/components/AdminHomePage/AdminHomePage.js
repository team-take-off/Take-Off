import React, { Component } from 'react';
import {connect} from 'react-redux';

class AdminHomePage extends Component {
    // Show this component on the DOM
    render() {
        return (
            <div>
                <h2>Pending Requests</h2>
                {JSON.stringify(this.props.requests)}
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    requests: state.requests
});
export default connect(mapStateToProps)(AdminHomePage);