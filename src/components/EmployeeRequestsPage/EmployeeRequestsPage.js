import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../Nav/Nav';
import RequestTabs from '../RequestTabs/RequestTabs';

class EmployeeRequestsPage extends Component {
    render() {        
        return (
            <>
                <Nav history={this.props.history} />
                <div className="page-container">
                    <h2>{this.props.reduxStore.user ? this.props.reduxStore.user.first_name + '\'s Requests' : 'Employee Requests'}</h2>
                    <RequestTabs forAdmin={false} />
                </div>
            </>
        );
    }
}
const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(EmployeeRequestsPage);
