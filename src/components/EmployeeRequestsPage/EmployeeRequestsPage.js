import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../Nav/Nav';
import RequestTabs from '../RequestTabs/RequestTabs';

class EmployeeRequestsPage extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER_REQUESTS', payload: { user: this.props.reduxStore.user.id } });
    }

    handleYearChange = (event) => {
        const action = {
            type: 'FETCH_USER_REQUESTS',
            payload: {
                year: event.target.value,
                user: this.props.reduxStore.user.id
            }
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {        
        return (
            <>
                <Nav history={this.props.history} />
                <div className="page-container">
                    <h2>{this.props.reduxStore.user ? this.props.reduxStore.user.first_name + '\'s Requests' : 'Employee Requests'}</h2>
                    <RequestTabs />
                </div>
            </>
        );
    }
}
const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(EmployeeRequestsPage);
