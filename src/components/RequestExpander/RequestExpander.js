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

    // Show this component on the DOM
    render() {
        return (
            <div>
                {this.renderTab()}
            </div>
        );
    }
}

export default RequestExpander;