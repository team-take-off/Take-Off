import React, { Component } from 'react';
import { connect } from 'react-redux';
import BuildEmployeeCalendar from './BuildEmployeeCalendar';

class EmployeeCalendarPage extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER_REQUESTS' });
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <BuildEmployeeCalendar requests={this.props.reduxStore.userRequests} />
            </div>
        );
    }
}
const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});
export default connect(mapReduxStoreToProps)(EmployeeCalendarPage);