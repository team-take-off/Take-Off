import React, { Component } from 'react';
import {connect} from 'react-redux';

class AdminHomePage extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_REQUESTS'})
    }
    // Show this component on the DOM
    render() {
        return (
            <div>
                <h2>Pending Requests</h2>
                {JSON.stringify(this.props.requests[0])}
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    requests: state.requests
});
export default connect(mapStateToProps)(AdminHomePage);