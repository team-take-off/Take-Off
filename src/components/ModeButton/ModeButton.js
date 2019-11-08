import React from 'react';
import { connect } from 'react-redux';

const ModeButton = (props) => {
    console.log(props);
    const clickHandler = () => {
        if (props.adminMode) {
            props.dispatch({ type: 'ADMIN_MODE_TOGGLE' });
            props.history.push('/home');
        } else {
            props.dispatch({ type: 'ADMIN_MODE_TOGGLE' });
            props.history.push('/admin/home');
        }
    };

    return (<button className={props.className} style={props.style} onClick={clickHandler}>
        {props.adminMode ? 'Admin Mode On 🔒' : 'Admin Mode Off'}
    </button>);
};

const mapReduxStoreToProps = reduxStore => ({
    adminMode: reduxStore.adminMode
});

export default connect(mapReduxStoreToProps)(ModeButton);
