import React from 'react';

import Nav from '../Nav/Nav';
import RequestTabs from '../RequestTabs/RequestTabs';

const AdminHomePage = (props) => {
    return (
        <>
            <Nav history={props.history} />
            <div className="page-container">
                <h2>Admin Inbox</h2>
                <RequestTabs forAdmin={true} />
            </div>
        </>
    );
}

export default AdminHomePage;