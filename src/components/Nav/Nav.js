import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import ModeButton from '../ModeButton/ModeButton';
import DynamicDrawer from '../DynamicDrawer/DynamicDrawer';
import './Nav.css';

// material ui
import { withStyles } from '@material-ui/core/styles';

const styles = {
  mobile: {
    '@media (min-width:700px)': {
      display: 'none'
    }
  },
  desktop: {
    '@media (max-width:700px)': {
      display: 'none'
    }
  },
}

class Nav extends Component {

    renderNavRight = () => {
        const { classes } = this.props;
        if (this.props.user.id) {
            if (this.props.user.role_id === 1 && this.props.adminMode) {
                return (
                    <div className={classnames(classes.desktop, "nav-right")}>
                        <Link className="nav-link" to="/admin/home">Home</Link>
                        <Link className="nav-link" to="/calendar">Calendar</Link>
                        <Link className="nav-link" to="/admin/list_employees">Manage Employees</Link>
                        <Link className="nav-link" to="/admin/search_requests">Search Requests</Link>
                        <ModeButton className="nav-link" />
                        <LogOutButton className="nav-link" />
                    </div>
                );
            } else {
                return (
                    <div className={classnames(classes.desktop, "nav-right")}>
                        <Link className="nav-link" to="/home">Home</Link>
                        <Link className="nav-link" to="/employee_requests">My Requests</Link>
                        <Link className="nav-link" to="/calendar">Calendar</Link>
                        {this.props.user.role_id === 1 && <ModeButton className="nav-link" />}
                        <LogOutButton className="nav-link" />
                    </div>
                )
            }
        }
    }

    render() {
        const { classes } = this.props;
        return (  
            <div className="nav">
                <div className={classnames(classes.mobile, "menu-icon")}><DynamicDrawer user={this.props.user} /></div>
                <h2 className="nav-title">Take-Off</h2>
                <div className="counter-balance"></div>
                {this.renderNavRight()}
            </div>
        );
    }
}

const mapReduxStoreToProps = reduxStore => ({
    user: reduxStore.user,
    adminMode: reduxStore.adminMode
});

export default withStyles(styles)(connect(mapReduxStoreToProps)(Nav));
