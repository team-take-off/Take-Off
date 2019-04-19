import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class EmployeeRequestsPage extends Component {
    componentDidMount() {
        this.props.dispatch({ type: 'FETCH_USER_REQUESTS' });
    }

    // setYear = (event) => {
    //     this.setState({
    //         year: event.target.value
    //     })
    // }     

    // Show this component on the DOM
    render() {
        // console.log(this.props.reduxStore.userRequests);
        // let userRequests = [];
        // if (this.state.year === '') {
        //     this.props.reduxStore.userRequests.map(request => {
        //         return userRequests.push(request);
        //     })
        // }
        // else if (this.state.year !== '' && this.state.year !== 'all') {

        //     for (let request of this.props.reduxStore.userRequests) {
        //         if (request.date.substr(0, 4) === this.state.year) {
        //             userRequests.push(request);
        //         }
        //     }
        // } else if (this.state.year === 'all') {
        //     for (let request of this.props.reduxStore.userRequests) {
        //         userRequests.push(request);
        //     }
        // }
        
        console.log(this.props.reduxStore.userRequests.pending);
        return (
            <div className="page-container">
                {/* <select onChange={this.setYear} defaultValue="all">
                    <option value="all">All Years</option>
                    {this.state.years.map((year, i) =>
                        <option key={i}>{year}</option>
                    )}
                </select> */}
                <RequestExpanderCollection
                    pending={this.props.reduxStore.userRequests.pending}
                    approved={this.props.reduxStore.userRequests.approved}
                    denied={this.props.reduxStore.userRequests.denied}
                    // past={this.props.reduxStore.userRequests.past}
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
