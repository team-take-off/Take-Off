import React, { Component } from 'react';
import RequestExpander from '../RequestExpander/RequestExpander';
import moment from 'moment';

class RequestExpanderCollection extends Component {

    // Show this component on the DOM
    render() {
        return (
            <div>
                <RequestExpander
                    title="Pending Requests"
                    open={true}
                    requests={this.props.pending}
                    forAdmin={this.props.forAdmin}
                    past={false}
                 />
                <RequestExpander
                    title="Approved Requests"
                    open={true}
                    requests={this.props.approved}
                    forAdmin={this.props.forAdmin}
                    past={false}
                />
                <RequestExpander
                    title="Denied Requests"
                    open={true}
                    requests={this.props.denied}
                    forAdmin={this.props.forAdmin}
                    past={false}
                />
                <RequestExpander
                    title="Past Requests"
                    open={false}
                    requests={this.props.past}
                    forAdmin={this.props.forAdmin}
                    past={true}
                />
            </div>
        );
    }
}

export default RequestExpanderCollection;