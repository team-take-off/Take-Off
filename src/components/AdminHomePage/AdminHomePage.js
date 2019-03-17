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
            <div>
                <RequestExpanderCollection requests={this.props.reduxStore.requests} forAdmin={true} />
            </div>
        );
    }
} 

const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});

export default connect(mapReduxStoreToProps)(AdminHomePage);