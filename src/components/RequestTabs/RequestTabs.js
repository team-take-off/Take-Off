import React from 'react';
import { connect } from 'react-redux';

import './RequestTabs.css';

const RequestTabs = (props) => {
    return (
        <div>
            <div className="tab-background-bar">
                <div className="tab-area">
                    <div className="tab active-tab">
                        <h4>Pending</h4>
                        <span className="count-badge">2</span>
                    </div>
                    <div className="tab">
                        <h4>Approved</h4>
                        <span className="count-badge">3</span>
                    </div>
                    <div className="tab">
                        <h4>Denied</h4>
                        <span className="count-badge">1</span>
                    </div>
                </div>
                
                <div className="filter-options-div">
                    <p>▼ Filter Options</p>
                </div>
            </div>
            <div className="card-area">

            </div>
        </div>
    );
};

const mapReduxStoreToProps = reduxStore => ({
    reduxStore: reduxStore
});

export default connect(mapReduxStoreToProps)(RequestTabs);