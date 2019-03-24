import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './google-logo.png';

const styleContainer = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: '2rem'
};

class LoginPage extends Component {
  render() {
    return (
      <div className="page-container">
        {/* http://localhost:5000 should be an environment variable */}
        {/* <a href="/api/user/auth/google">Sign in with Gmail</a> */}
        <div style={styleContainer}>
          <button className="login-button" onClick={() => window.location = '/api/user/auth/google'}><img src={logo} alt="" height="40" /> Login using LRC account</button>
        </div>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(LoginPage);
