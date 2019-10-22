import React, { Component } from 'react';
import {connect} from 'react-redux';

import BuildCalendar from './BuildCalendar';
import Nav from '../Nav/Nav';

class AdminCalendarPage extends Component {
    componentDidMount() { 
        this.props.dispatch({type: 'FETCH_REQUESTS'});
    }
      
    // Show this component on the DOM
    render() {
        return (
            <>
                <Nav history={this.props.history} />
                <div>
                    <BuildCalendar requests={this.props.requests} />
                </div>
            </>
        );
    }
}

const mapReduxStoreToProps = reduxStore => ({
    requests: reduxStore.requests
});

export default connect(mapReduxStoreToProps)(AdminCalendarPage);