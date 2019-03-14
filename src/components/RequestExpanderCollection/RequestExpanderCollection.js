import React, { Component } from 'react';
import RequestExpander from '../RequestExpander/RequestExpander';
import moment from 'moment';

class RequestExpanderCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingRequests: [],
            approvedRequests: [],
            pastRequests: []
        };
    }

    groupBatchIds = () => {
        let arrayOfCards = [];
        for (const id of this.props.reduxStore.requests) {
            const requestDatesArrary = this.props.reduxStore.requests.filter(x =>
                id.id === x.batch_of_requests_id
            )
            console.log(requestDatesArrary);
            console.log(moment((requestDatesArrary[requestDatesArrary.length - 1]).date).format('YYYY-MM-DD'))
        }
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                {JSON.stringify(this.props.requests)}
                <RequestExpander />
                <RequestExpander />
                <RequestExpander />
            </div>
        );
    }
}

export default RequestExpanderCollection;