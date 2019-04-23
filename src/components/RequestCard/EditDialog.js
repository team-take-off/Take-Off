import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import swal from 'sweetalert';
const moment = require('moment-business-days');

class EditDialog extends Component {

  state = {
    startDate: '',
    startDateType: '8',
    endDate: '',
    endDateType: '8',
  }

  componentWillReceiveProps(props) {
    if (props.open) {
      let startEntry = props.startingArray[0];
      let endEntry = props.startingArray[props.startingArray.length - 1];
      let sDateVal = moment(startEntry.date).format('YYYY-MM-DD');
      let eDateVal = moment(endEntry.date).format('YYYY-MM-DD');
      this.setState({
        startDate: sDateVal,
        startDateType: startEntry.hours.toString(),
        endDate: eDateVal,
        endDateType: endEntry.hours.toString(),
      });
    }
  }

  handleChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    })
  }

  handleCommit = () => {
    let bundle = this.props.startingArray[0]
    this.props.dispatch({
      type: 'BOGUS_DISPATCH',
      payload: {
        ...this.state,
        bundleId: bundle.batch_of_requests_id,
        type: bundle.type,
      }
    })
    this.handleClose();
  }

  handleClose = () => {
    this.props.closeEdit();
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <div className="inner-dialog">
          <label htmlFor="startDate">Start Date: </label>
          <input onChange={this.handleChange} name="startDate" type="date"
            min={moment().subtract(7, 'days').format('YYYY-MM-DD')}
            value={this.state.startDate}
          />
          <select onChange={this.handleChange} name="startDateType" value={this.state.startDateType}>
            <option value="8">Full Day</option>
            <option value="4">Half Day</option>
          </select>
          <br />
          <br />
          <label htmlFor="endDate">End Date: </label>
          <input onChange={this.handleChange} name="endDate" type="date"
            min={moment().subtract(7, 'days').format('YYYY-MM-DD')}
            value={this.state.endDate}
          />
          <select onChange={this.handleChange} name="endDateType" value={this.state.endDateType}>
            <option value="8">Full Day</option>
            <option value="4">Half Day</option>
          </select>
          <br />
          <br />
          <button onClick={this.handleCommit}>Commit</button>
          <button onClick={this.handleClose}>Cancel</button>
        </div>
      </Dialog>
    )
  }

}

export default connect()(EditDialog);