import React from 'react';
import { connect } from 'react-redux';

const ModeButton = (props) => (
    <button className={props.className} onClick={() => props.dispatch({ type: 'ADMIN_MODE_TOGGLE' })}>
        {props.adminMode ? 'Admin Mode On' : 'Admin Mode Off'}
    </button>
);

const mapReduxStoreToProps = reduxStore => ({
    adminMode: reduxStore.adminMode
});

export default connect(mapReduxStoreToProps)(ModeButton);
