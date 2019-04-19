import React, { Component } from 'react';
import { connect } from 'react-redux';

import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class AdminHomePage extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_REQUESTS'});
    }

    // Show this component on the DOM
    render() {
        return (
            <div className="page-container">
                <RequestExpanderCollection 
                    pending={this.props.reduxStore.newRequests.pending}
                    approved={this.props.reduxStore.newRequests.approved}
                    denied={this.props.reduxStore.newRequests.denied}
                    past={this.props.reduxStore.newRequests.past}
                    requests={this.props.reduxStore.newRequests.requests}
                    forAdmin={true}
                />
            </div>
        );
    }
} 

const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});

export default connect(mapReduxStoreToProps)(AdminHomePage);