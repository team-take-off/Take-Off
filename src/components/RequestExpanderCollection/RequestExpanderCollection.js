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
        const uniqueBatches = this.filterUniqueBatches(requests);
        let pendingRequests = [];
        let approvedRequests = [];
        let pastRequests = [];
        
        for (let batch of uniqueBatches) {
            const id = batch.id;
            const requestBatchArray = requests.filter(
                request => request.batch_of_requests_id === id
            );
            requestBatchArray.sort((left, right) => {
                return moment(left.date).diff(moment(right.date));
            });
            if (moment(requestBatchArray[requestBatchArray.length - 1]).diff(currentTime) > 0) {
                pastRequests.push(requestBatchArray);
            } else if (batch.approved) {
                approvedRequests.push(requestBatchArray);
            } else {
                pendingRequests.push(requestBatchArray);
            }
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