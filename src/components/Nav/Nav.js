import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';

const Nav = (props) => (
  <div className="nav">
    <Link to="/home">
      <h2 className="nav-title">Take-Off</h2>
    </Link>
    <div className="nav-right">
    {props.user.id && (
      props.user.role_id === 1 ? 
        <>
          <Link className="nav-link" to="/home">Employee Home</Link>
          <Link className="nav-link" to="/admin/home">Admin Home</Link>
          <Link className="nav-link" to="/admin/calendar">Calendar</Link>
          <Link className="nav-link" to="/admin/search_employee">Search Employees</Link>
          <LogOutButton className="nav-link" />
        </>
      :
        <>
          <Link className="nav-link" to="/home">
            {props.user.id ? 'Home' : 'Login / Register'}
          </Link>
          <Link className="nav-link" to="/employee_requests">
            {props.user.id && 'My Requests'}
          </Link>
          <LogOutButton className="nav-link"/>
        </>
    )}
    </div>
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);
