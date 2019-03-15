import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import DynamicDrawer from './DynamicDrawer';
import './Nav.css';

// material ui
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import { withStyles } from '@material-ui/core/styles';

const styles  = {
  myClass:{
      '@media (min-width:600px)' : {
          display: 'none'
  }}
}

class Nav extends Component {

  render() {
    // const matches = useMediaQuery('(min-width:600px');
    const {classes} = this.props
  return (  
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Take-Off</h2>
      </Link>
      
      <div className="nav-right">
      {/* <span>{`(min-width:600px) matches:${matches}`}</span> */}
      <div className={classes.myClass}><DynamicDrawer /></div>
      {this.props.user.id && (
       this.props.user.role_id === 1 ? 
        <>
          <Link className="nav-link" to="/home">Employee Home</Link>
          <Link className="nav-link" to="/admin/home">Admin Home</Link>
          <Link className="nav-link" to="/admin/calendar">Calendar</Link>
          <Link className="nav-link" to="/admin/list_employees">Manage Employees</Link>
          <Link className="nav-link" to="/admin/search_employee">Search Employees</Link>
          <LogOutButton className="nav-link" />
        </>
      :
        <>
          <Link className="nav-link" to="/home">
            {this.props.user.id ? 'Home' : 'Login / Register'}
          </Link>
          <Link className="nav-link" to="/employee_requests">
            {this.props.user.id && 'My Requests'}
          </Link>
          <LogOutButton className="nav-link"/>
        </>
    )}
    </div>
  </div>
);
  }
}

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default withStyles(styles)(connect(mapStateToProps)(Nav));
