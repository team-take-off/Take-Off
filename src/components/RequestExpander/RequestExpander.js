import React, { Component } from 'react';

import RequestCard from '../RequestCard/RequestCard';

class RequestExpander extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    // Render a button for toggling between open and closed
    renderToggleButton = () => {
        if (this.state.open) {
            return <button onClick={this.toggleOpen}>[ - ]</button>;
        } else {
            return <button onClick={this.toggleOpen}>[ + ]</button>;
        }
    }

    // Toggle this expanding div between open and closed
    toggleOpen = () => {
        this.setState({
            open: !this.state.open,
        });
    }

    // Render a summary of requests in this category
    renderCards = () => {
        if (this.state.open) {
            if (this.props.requests.length === 0) {
                return <p>[ No requests in this category ]</p>
            } else {
                return (
                    <div>
                        {this.props.requests.map((requestArray, i) =>
                            <RequestCard key={i} requestArray={requestArray} onApprove={this.onApprove} />
                        )}
                    </div>
                );
            }
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
                {this.renderToggleButton()}
                {this.renderCards()}
            </div>
        );
    }
}

export default RequestExpander;