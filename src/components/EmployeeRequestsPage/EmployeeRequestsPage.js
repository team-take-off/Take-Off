import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestExpanderCollection from '../RequestExpanderCollection/RequestExpanderCollection';

class EmployeeRequestsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            years: [],
            year:'',
        };
    }

    componentDidMount() {
        let action = { type: 'FETCH_USER_REQUESTS' }
        this.props.dispatch(action);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.reduxStore.userRequests !== this.props.reduxStore.userRequests) {
            let uniqueDates = [];
            for (let request of this.props.reduxStore.userRequests) {
                uniqueDates.push(request.date.substr(0, 4))
            }
            this.setState({
                ...this.state,
                years: [...new Set(uniqueDates)]
            });
        }
    }

    setYear = (event) => {
        this.setState({
            year: event.target.value
        })
    }     

    // Show this component on the DOM
    render() {
            let userRequests = [];
            if (this.state.year === '') {
                this.props.reduxStore.userRequests.map(request => {
                   return userRequests.push(request);
                })
            }
            else if (this.state.year !== '' && this.state.year !== 'all') {

                for (let request of this.props.reduxStore.userRequests) {
                    if (request.date.substr(0, 4) === this.state.year) {
                        userRequests.push(request);
                    }
                }
            } else if (this.state.year === 'all') {
                for (let request of this.props.reduxStore.userRequests) {
                    userRequests.push(request);
                }
            }
        
        return (
            <div className="page-container">
                <select onChange={this.setYear} defaultValue="all">
                    <option value="all">All Years</option>
                    {this.state.years.map((year, i) =>
                        <option key={i}>{year}</option>
                    )}
                </select>
                <RequestExpanderCollection
                    pending={this.props.reduxStore.requests.pending}
                    approved={this.props.reduxStore.requests.approved}
                    denied={this.props.reduxStore.requests.denied}
                    past={this.props.reduxStore.requests.past}
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
