import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from '@material-ui/icons/Menu';

import ModeButton from '../ModeButton/ModeButton';

const styles = {
    list: {
        width: '70vw',
    },
    fullList: {
        width: 'auto',
    },
};

const buttonStyle = {
    color: '#e6e7e6',
    backgroundColor: '#222d31',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '12px',
    width: '100%',
    height: '5vh',
}

const logoutButtonStyle = {
    color: '#e6e7e6',
    backgroundColor: '#9d2b33',
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '12px',
    width: '100%',
    height: '5vh',
}

class DynamicDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            left: false,
        };
    }

    // Render the list of buttons in the drawer
    renderList = () => {
        if (this.props.user.id) {
            if (this.props.user.role_id === 1 && this.props.adminMode) {
                return this.renderAdminList();
            } else {
                return this.renderEmployeeList();
            }
        }
    }

    // Render the list of buttons for an administrator with admin-mode on
    renderAdminList = () => {
        return (
            <List>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/home')}>Home</Button>
                </ListItem>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/calendar')}>Calendar</Button>
                </ListItem>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/manage_employees')}>Manage Employees</Button>
                </ListItem>
                {/* <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/search_requests')}>Search Requests</Button>
                </ListItem> */}
                <Divider />
                <ListItem button>
                    <ModeButton history={this.props.history} style={logoutButtonStyle} />
                </ListItem>
                <ListItem button>
                    <Button style={logoutButtonStyle} onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>Logout</Button>
                </ListItem>
            </List>
        );
    }

    // Render the list of buttons for an employee (or an administrator with 
    // admin-mode off).
    renderEmployeeList = () => {
        return (
            <List>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/home')}>{this.props.user.id > 0 ? 'Home' : 'Login / Register'}</Button>
                </ListItem>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/my_requests')}>My Requests</Button>
                </ListItem>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/calendar')}>Calendar</Button>
                </ListItem>
                <Divider />
                {this.props.user.role_id === 1 && 
                    <ListItem button>
                        <ModeButton history={this.props.history} style={logoutButtonStyle} />
                    </ListItem>
                }
                <ListItem button>
                    <Button style={logoutButtonStyle} onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>Logout</Button>
                </ListItem>
            </List>
        );
    }

    // Open or close this drawer
    toggleDrawer = (side, open) => () => {
        this.setState({
          [side]: open,
        });
    };
    
    // Show this on the DOM
    render() {
        const { classes } = this.props;
        const sideList = (
            <div className={classes.list}>
                {this.renderList()}
            </div>
          );
      
        return (
            <div>
                <MenuIcon onClick={this.toggleDrawer('left', true)}/>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    > 
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}

const mapReduxStoreToProps = reduxStore => ({
    adminMode: reduxStore.adminMode
});

export default connect(mapReduxStoreToProps)(withStyles(styles)(withRouter(DynamicDrawer)));