import React, { Component } from 'react';
import { connect } from 'react-redux';

class RequestFromRow extends Component {

    deleteRow = () => {
        const action = {
            type: 'REMOVE_VACATION_REQUEST',
            payload: {
                index: this.props.index,
            }
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <button onClick={this.deleteRow}>-</button>

            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(RequestFromRow);