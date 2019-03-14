import React, { Component } from 'react';
import RequestExpander from '../RequestExpander/RequestExpander';
import moment from 'moment';

class RequestExpanderCollection extends Component {
    constructor(props) {
        super(props);
        this.state = this.getRequestArrays();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requests !== this.props.requests) {
            this.setState(this.getRequestArrays());
            const uniqueBatchIDs = this.findUniqueBatches(this.props.requests);
            console.log(uniqueBatchIDs);
        }
    }

    getRequestArrays = () => {
        const requests = this.props.requests;
        const uniqueBatches = this.filterUniqueBatches(requests);
        let pendingRequests = [];
        let approvedRequests = [];
        let pastRequests = [];
        
        for (let batch of uniqueBatches) {
            const id = batch.id;
        }

        return {
            pendingRequests: pendingRequests,
            approvedRequests: approvedRequests,
            pastRequests: pastRequests
        };
    }

    filterUniqueBatches = (requests) => {
        if (requests) {
            return requests.filter((requestItem, index, uniqueArray) => {
                if (uniqueArray.indexOf(requestItem) === index) {
                    return requestItem;
                }
            }); 
        } else {
            return [];
        }
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
                <RequestExpander open={true} requests={this.state.pendingRequests} />
                <RequestExpander open={true} requests={this.state.approvedRequests} />
                <RequestExpander open={false} requests={this.state.pastRequests} />
            </div>
        );
    }
}

export default RequestExpanderCollection;