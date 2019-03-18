import React, { Component } from 'react';
import RequestExpander from '../RequestExpander/RequestExpander';
import moment from 'moment';

class RequestExpanderCollection extends Component {
    constructor(props) {
        super(props);
        this.state = this.getRequestArrays();
    }

    // If the array of input requests changes. Regenerate the sorted output 
    // arrays.
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requests !== this.props.requests) {
            this.setState(this.getRequestArrays());
        }
    }

    // Sorts requests into arrays for pending, approved, and past requests
    getRequestArrays = () => {
        const currentTime = moment();
        const requests = this.props.requests;
        const batchIDs = this.filterUniqueBatchIDs(requests);
        let pendingRequests = [];
        let approvedRequests = [];
        let pastRequests = [];
        
        for (let id of batchIDs) {
            // Sort requests into batches based on their 'batch_of_requests_id'
            const requestBatchArray = requests.filter(
                request => request.batch_of_requests_id === id
            );

            // Sort batches into the output arrays
            if (requestBatchArray.length > 0) {
                const lastTimeInBatch = this.getLastMoment(requestBatchArray);
                if (currentTime > lastTimeInBatch) {
                    pastRequests.push(requestBatchArray);
                } else if (requestBatchArray[0].status === 'approved') {
                    approvedRequests.push(requestBatchArray);
                } else {
                    pendingRequests.push(requestBatchArray);
                }
            }
        }

        return {
            pendingRequests: pendingRequests,
            approvedRequests: approvedRequests,
            pastRequests: pastRequests
        };
    }

    // Returns an array with unique batch_of_request_id
    filterUniqueBatchIDs = (requests) => {
        let uniqueObject = {};
        for (let request of requests) {
            uniqueObject[request.batch_of_requests_id] = 1;
        }
        let uniqueArray = [];
        for (let id in uniqueObject) {
            uniqueArray.push(parseInt(id));
        }
        return uniqueArray;
    }

    // Return a Moment.js object corresponding to the latest date in an array of
    // requests.
    getLastMoment = (requests) => {
        // Read in an array of objects with the attribute 'date:' and convert
        // to an array of class 'moment' from Moment.js.
        let momentArray = [];
        for (let element of requests) {
            momentArray.push(moment(element.date));
        }

        // Sort the array of moments
        momentArray.sort((left, right) => {
            return left.diff(right);
        });

        return momentArray[momentArray.length - 1];
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <RequestExpander
                    title="Pending Requests"
                    open={true}
                    requests={this.state.pendingRequests}
                    forAdmin={this.props.forAdmin}
                    past={false}
                 />
                <RequestExpander
                    title="Approved Requests"
                    open={true}
                    requests={this.state.approvedRequests}
                    forAdmin={this.props.forAdmin}
                    past={false}
                />
                <RequestExpander
                    title="Past Requests"
                    open={false}
                    requests={this.state.pastRequests}
                    forAdmin={this.props.forAdmin}
                    past={true}
                />
            </div>
        );
    }
}

export default RequestExpanderCollection;