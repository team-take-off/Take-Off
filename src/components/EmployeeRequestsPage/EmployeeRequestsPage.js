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
            this.props.reduxStore.userRequests.map((request) => {
                uniqueDates.push(request.date.substr(0, 4))
            });
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
            if (this.state.year == '') {
                this.props.reduxStore.userRequests.map((request) => {
                    userRequests.push(request)
                })
            }
            else if (this.state.year != '' && this.state.year != 'all') {

                this.props.reduxStore.userRequests.map((request) => {
                    if (request.date.substr(0, 4) == this.state.year) {
                        userRequests.push(request)
                    }
                })
            } else if (this.state.year == 'all') {
                this.props.reduxStore.userRequests.map((request) => {
                    userRequests.push(request)
                })
            }
        
        return (
            <div>
            
                <select onChange={this.setYear}>
                    <option value="" disabled selected>Select a Year</option>
                    <option value="all">All Years</option>
                    {this.state.years.map((year, i) =>
                        <option key={i}>{year}</option>
                    )}
                </select>
                {/* {JSON.stringify(this.props.reduxStore.userRequests)} */}
                <RequestExpanderCollection requests={userRequests} />
                <p>[ EmployeeRequestsPage ]</p>
            </div>
        );
    }
}
const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(EmployeeRequestsPage);