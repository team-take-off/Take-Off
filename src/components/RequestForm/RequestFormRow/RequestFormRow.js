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
        let typeString = '';
        if (this.props.type === 1) {
            typeString = 'REMOVE_VACATION_REQUEST';
        }else{
            typeString = 'REMOVE_SICK_REQUEST';
        }
        const action = {
            type: typeString,
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
        let typeString = '';
        if (this.props.type === 1) {
            typeString = 'SET_VACATION_REQUEST';
        } else {
            typeString = 'SET_SICK_REQUEST';
        }
            const action = {
                type: typeString,
                payload: {
                    index: this.props.index,
                    request: {
                        date: event.target.value,
                        hours: this.state.hours
                    }
                }
            };
        this.props.dispatch(action);
    }

    setHours = (event) => {
        this.setState({
            ...this.state,
            hours: parseInt(event.target.value)
        });
        let typeString = '';
        if (this.props.type === 1) {
            typeString = 'SET_VACATION_REQUEST';
        } else {
            typeString = 'SET_SICK_REQUEST';
        }
            const action = {
                type: typeString,
                payload: {
                    index: this.props.index,
                    request: {
                        date: this.state.date,
                        hours: parseInt(event.target.value)
                    }
                }
            };
        this.props.dispatch(action);
}

    // Show this component on the DOM
    render() {
        return (
            <div>
                <button onClick={this.deleteRow}>-</button>
                <input onChange={this.setDate} type="date" value={this.state.date} />
                {/* <input onChange={this.setHours} type="radio" name="full" value={8} />Full Day
                <input onChange={this.setHours} type="radio" name="half" value={4} />Half Day */}
                <select onChange={this.setHours} value={this.state.hours}>
                    <option value="8">Full Day</option>
                    <option value="4">Half Day</option>
                </select>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

export default connect(mapStateToProps)(RequestFromRow);