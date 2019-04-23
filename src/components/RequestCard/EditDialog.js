import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dialog } from '@material-ui/core';

class EditDialog extends Component {


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
          {JSON.stringify(this.props.startingArray, null, 2)}
          <button onClick={this.handleCommit}>Commit</button>
          <button onClick={this.handleCancel}>Cancel</button>
        </div>
      </Dialog>
    )
  }

}

export default connect()(EditDialog);