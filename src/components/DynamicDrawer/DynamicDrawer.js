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
    width: '100%',
}

const logoutButtonStyle = {
    color: '#e6e7e6',
    backgroundColor: '#9d2b33',
    textTransform: 'none',
    fontWeight: 'bold',
    width: '100%',
}

class DynamicDrawer extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            left: false,
        }
    }

    renderList = () => {
        if (this.props.user.id) {
            if (this.props.user.role_id === 1) {
                return this.renderAdminList();
            } else {
                return this.renderEmployeeList();
            }
        }
    }

    renderAdminList = () => {
        return (
            <List>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/home')}>Employee Home</Button>
                </ListItem>
                <ListItem button >
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/home')}>Admin Home</Button>
                </ListItem>
                <ListItem button>
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/calendar')}>Calendar</Button>
                </ListItem>
                <ListItem button >
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/list_employees')}>Manage Employees</Button>
                </ListItem>
                <ListItem button >
                    <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/search_employee')}>Search Employees</Button>
                </ListItem>
                <Divider />
                <ListItem button >
                    <Button style={logoutButtonStyle} onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>Logout</Button>
                </ListItem>
            </List>
        );
    }

    renderEmployeeList = () => {

    }

    toggleDrawer = (side, open) => () => {
        this.setState({
          [side]: open,
        });
    };
    
    render() {
        const {classes} = this.props;
        const sideList = (
            <div className={classes.list}>
                {this.props.user.id && (
                this.props.user.role_id === 1 ? 
                    <>
                        <List>
                            <ListItem button>
                                <Button style={buttonStyle} onClick={() => this.props.history.push('/home')}>Employee Home</Button>
                            </ListItem>
                            <ListItem button >
                                <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/home')}>Admin Home</Button>
                            </ListItem>
                            <ListItem button>
                                <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/calendar')}>Calendar</Button>
                            </ListItem>
                            <ListItem button >
                                <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/list_employees')}>Manage Employees</Button>
                            </ListItem>
                            <ListItem button >
                                <Button style={buttonStyle} onClick={() => this.props.history.push('/admin/search_employee')}>Search Employees</Button>
                            </ListItem>
                            <Divider />
                            <ListItem button >
                                <Button style={logoutButtonStyle} onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>Logout</Button>
                            </ListItem>
                        </List>
                    
                    </>
                :
                    <>
                        <ListItem button>
                            <Button style={buttonStyle} onClick={() => this.props.history.push('/home')}>{this.props.user.id > 0 ? 'Home' : 'Login / Register'}</Button>
                        </ListItem>
                        <ListItem button >
                            <Button style={buttonStyle} onClick={() => this.props.history.push('/employee_requests')}>{this.props.user.id && 'My Requests'}</Button>
                        </ListItem>
                        <Divider />
                        <ListItem button >
                            <Button style={logoutButtonStyle} onClick={() => this.props.dispatch({ type: 'LOGOUT' })}>Logout</Button>
                        </ListItem>
                    </>
                    
                )}
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

export default connect()(withStyles(styles)(withRouter(DynamicDrawer)));