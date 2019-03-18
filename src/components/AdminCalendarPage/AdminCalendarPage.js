import React, { Component } from 'react';
import {connect} from 'react-redux';
import BuildAdminCalendar from './BuildAdminCalendar';

class AdminCalendarPage extends Component {
    componentDidMount() { 
        this.props.dispatch({type: 'FETCH_REQUESTS'});
    }
      
    // Show this component on the DOM
    render() {
    return (
      <div>
          <BuildAdminCalendar requests={this.props.reduxStore.requests} />
        </div>
        );
    }
}
const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});
export default connect(mapReduxStoreToProps)(AdminCalendarPage);