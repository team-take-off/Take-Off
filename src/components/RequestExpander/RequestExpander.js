import React, { Component } from 'react';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';

import './RequestExpander.css';
import RequestCard from '../RequestCard/RequestCard';

class RequestExpander extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    // Render a title with a button for toggling between open and closed
    renderTitle = () => {
        return (
            <div onClick={this.toggleOpen} className="request-expander-title">
                <h3>{this.props.title}</h3>
                <button>{this.state.open ? <ArrowDownIcon /> : <ArrowLeftIcon />}</button>
            </div>
        );
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
                            <RequestCard
                                key={i}
                                requestArray={requestArray}
                                forAdmin={this.props.forAdmin}
                                past={this.props.past}
                            />
                        )}
                    </div>
                );
            }
        }
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                {this.renderTitle()}
                {this.renderCards()}
            </div>
        );
    }
}

export default RequestExpander;