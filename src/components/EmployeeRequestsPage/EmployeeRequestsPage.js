import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class EmployeeRequestsPage extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER_REQUESTS' });
    }

    handleYearChange = (event) => {
        const action = {
            type: 'FETCH_USER_REQUESTS',
            payload: { year: event.target.value }
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {        
        console.log(this.props.reduxStore.userRequests.pending);
        return (
            <div className="page-container">
                <select onChange={this.handleYearChange} defaultValue="">
                    <option value="">Recent Years</option>
                    {this.props.reduxStore.userRequests.years.map((year, i) =>
                        <option key={i}>{year}</option>
                    )}
                </select>
                <RequestExpanderCollection
                    pending={this.props.reduxStore.userRequests.pending}
                    approved={this.props.reduxStore.userRequests.approved}
                    denied={this.props.reduxStore.userRequests.denied}
                    past={this.props.reduxStore.userRequests.past}
                    requests={this.props.reduxStore.userRequests.requests}
                    forAdmin={false}
                />
            </div>
        );
    }
}
const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(EmployeeRequestsPage);
