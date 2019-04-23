import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';
import swal from 'sweetalert';
const moment = require('moment-business-days');

class EditDialog extends Component {

  state = {
    startDate: '',
    startDateType: 8,
    endDate: '',
    endDateType: 8,
  }

  componentWillReceiveProps(props) {
    if(props.open) {
      let startEntry = props.startingArray[0];
      let endEntry = props.startingArray[props.startingArray.length - 1];
      let sDateVal = moment(startEntry.date).format('YYYY-MM-DD');
      let eDateVal = moment(endEntry.date).format('YYYY-MM-DD');
      this.setState({
        startDate: sDateVal,
        startDateType: startEntry.hours,
        endDate: eDateVal,
        endDateType: endEntry.hours,
      });
    }
  }

  renderStartDate = () => {
    return (
      <div>

      </div>
    )
  }

  handleCommit = () => {
    this.props.closeEdit();
  }

  handleCancel = () => {
    this.props.closeEdit();
  }

  render() {
    return (
      <Dialog open={this.props.open}>
        <div className="inner-dialog">
          <div>
            <p>Start Date: {this.state.startDate}</p>
            <p>{this.state.startDateType === 8? 'Full Day' : 'Half Day'}</p>
          </div>
          <div>
            <p>End Date: {this.state.endDate}</p>
            <p>{this.state.endDateType === 8? 'Full Day' : 'Half Day'}</p>
          </div>
          {this.renderStartDate()}
          <button onClick={this.handleCommit}>Commit</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </div>
      </Dialog>
    )
  }

}

export default connect()(EditDialog);