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
        
        console.log(this.props.reduxStore.newUserRequests.pending);
        return (
            <div className="page-container">
                {/* <select onChange={this.setYear} defaultValue="all">
                    <option value="all">All Years</option>
                    {this.state.years.map((year, i) =>
                        <option key={i}>{year}</option>
                    )}
                </select> */}
                <RequestExpanderCollection
                    pending={this.props.reduxStore.newUserRequests.pending}
                    approved={this.props.reduxStore.newUserRequests.approved}
                    denied={this.props.reduxStore.newUserRequests.denied}
                    // past={this.props.reduxStore.newUserRequests.past}
                    requests={this.props.reduxStore.newUserRequests.requests}
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
