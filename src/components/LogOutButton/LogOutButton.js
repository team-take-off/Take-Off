import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const LogOutButton = props => {
    const handleLogout = () => {
        props.dispatch({ type: 'LOGOUT' });
        props.history.push('/');
    };
    return (
        <button className={props.className} onClick={handleLogout}>
            Log Out
        </button>
    );
};

export default withRouter(connect()(LogOutButton));
