import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import DynamicDrawer from './DynamicDrawer';
import './Nav.css';

// material ui
import { withStyles } from '@material-ui/core/styles';

const styles  = {
  mobile:{
      '@media (min-width:700px)' : {
          display: 'none'
  }},
  desktop:{
    '@media (max-width:700px)' : {
        display: 'none'
}},
}

class Nav extends Component {

  render() {
    const {classes} = this.props
  return (  
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Take-Off</h2>
      </Link>
      {/* Runs if the window width is less than 700px */}
      <div className={classnames(classes.mobile, "menu-icon")}><DynamicDrawer user={this.props.user}/></div>
      <div className={classnames(classes.desktop, "nav-right")}>
      
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
const mapStateToProps = state => ({
  user: state.user,
});

export default withStyles(styles)(connect(mapStateToProps)(Nav));
