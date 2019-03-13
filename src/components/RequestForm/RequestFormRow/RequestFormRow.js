import React, { Component } from 'react';
import { connect } from 'react-redux';

class RequestFromRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.request.date,
            hours: this.props.request.hours,
        }
    }

    // Update the value of the date when the component updates
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.request.date !== this.props.request.date ||
            prevProps.request.hours !== this.props.request.hours) {
            this.setState({
                ...this.state,
                date: this.props.request.date,
                hours: this.props.request.hours,
            });
        }
    }

    // Send a request to the reduxStore to remove the vacation request 
    // corresponding to the current row.
    deleteRow = () => {
        const action = {
            type: 'REMOVE_VACATION_REQUEST',
            payload: {
                index: this.props.index,
            }
        };
        this.props.dispatch(action);
    }

    // When the date input is selected. Update this components state and update 
    // the reduxStore
    setDate = (event) => {
        this.setState({
            ...this.state,
            date: event.target.value
        });
        const action = {
            type: 'SET_VACATION_REQUEST',
            payload: {
                index: this.props.index,
                date: event.target.value
            }
        };
        this.props.dispatch(action);
    }
    
    setHours = (event) => {
        this.setState({
            ...this.state,
            hours: event.target.value
        });
        const action = {
            type: 'SET_VACATION_REQUEST',
            payload: {
                index: this.props.index,
                hours: event.target.value
            }
        };
        this.props.dispatch(action);
    }

    // Show this component on the DOM
    render() {
        console.log('in render() for RequestFormRow ');
        return (
            <div>
                <button onClick={this.deleteRow}>-</button>
                <input onChange={this.setDate} type="date" value={this.state.date} />
                <input onChange={this.setHours} type="radio" name="full" value={8} />Full Day
                <input onChange={this.setHours} type="radio" name="half" value={4} />Half Day
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(RequestFromRow);