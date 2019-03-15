import React, { Component } from 'react';

import RequestCard from '../RequestCard/RequestCard';

class RequestExpander extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    renderTab = () => {
        if (this.state.open) {
            return <span>[ - ]</span>;
        } else {
            return <span>[ + ]</span>;
        }
    }

    onApprove = () => {
        console.log('in RequestExpander onApprove');
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <h3>{this.props.title}</h3>
                {this.renderTab()}
                {this.props.requests.map((requestArray, i) =>
                    <RequestCard key={i} requestArray={requestArray} onApprove={this.onApprove} />
                )}
            </div>
        );
    }
}

export default RequestExpander;