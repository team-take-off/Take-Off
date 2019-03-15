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
        }
    }

    getRequestArrays = () => {
        const currentTime = moment();
        const requests = this.props.requests;
        const batchIDs = this.filterUniqueBatchIDs(requests);
        let pendingRequests = [];
        let approvedRequests = [];
        let pastRequests = [];
        
        for (let id of batchIDs) {
            const requestBatchArray = requests.filter(
                request => parseInt(request.batch_of_requests_id) === parseInt(id)
            );

            if (requestBatchArray.length > 0) {
                // Read in an array of objects with the attribute 'date:' and convert
                // to an array of class 'moment' from Moment.js.
                let momentArray = [];
                for (let element of requestBatchArray) {
                    momentArray.push(moment(element.date, 'YYYY-MM-DD'));
                }

                // Sort the array of moments
                momentArray.sort((left, right) => {
                    return left.diff(right);
                });

                if (currentTime < momentArray[momentArray.length - 1]) {
                    pastRequests.push(requestBatchArray);
                } else if (requestBatchArray[0].approved) {
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

    filterUniqueBatchIDs = (requests) => {
        let uniqueObject = {};
        for (let request of requests) {
            uniqueObject[request.batch_of_requests_id] = 1;
        }
        let uniqueArray = [];
        for (let id in uniqueObject) {
            uniqueArray.push(id);
        }
        return uniqueArray;
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <RequestExpander title="Pending Requests" open={true} requests={this.state.pendingRequests} />
                <RequestExpander title="Approved Requests" open={true} requests={this.state.approvedRequests} />
                <RequestExpander title="Past Requests" open={false} requests={this.state.pastRequests} />
            </div>
        );
    }
}

export default RequestExpanderCollection;