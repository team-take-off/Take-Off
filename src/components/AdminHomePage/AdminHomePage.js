import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../Nav/Nav';
import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class AdminHomePage extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_REQUESTS'});
    }

    // Show this component on the DOM
    render() {
        return (
            <>
                <Nav history={this.props.history} />
                <div className="page-container">
                    <h2>Admin Inbox</h2>
                    <RequestExpanderCollection 
                        pending={this.props.reduxStore.requests.pending}
                        approved={this.props.reduxStore.requests.approved}
                        denied={this.props.reduxStore.requests.denied}
                        past={this.props.reduxStore.requests.past}
                        forAdmin={true}
                    />
                </div>
            </>
        );
    }
} 

const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});

export default connect(mapReduxStoreToProps)(AdminHomePage);