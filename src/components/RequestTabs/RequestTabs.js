import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './RequestTabs.css';
import RequestCard from '../RequestCard/RequestCard';

const TABS = {
    pending: 1,
    approved: 2,
    denied: 3
};

const RequestTabs = (props) => {
    const [activeTab, setActiveTab] = useState(TABS.pending);

    useEffect(() => {
        console.log('in useEffect()');
        props.dispatch({ type: 'SET_FILTERS', payload: { employee: props.employee, status: activeTab, year: null } });
    }, []);

    const activatePending = () => {
        setActiveTab(TABS.pending);
        props.dispatch({ type: 'SET_STATUS_FILTER', payload: TABS.pending });
    }

    const activateApproved = () => {
        setActiveTab(TABS.approved);
        props.dispatch({ type: 'SET_STATUS_FILTER', payload: TABS.approved });
    }

    const activateDenied = () => {
        setActiveTab(TABS.denied);
        props.dispatch({ type: 'SET_STATUS_FILTER', payload: TABS.denied });
    }

    const pendingActive = () => {
        if (activeTab === TABS.pending) {
            return true;
        }
        return false;
    }
    
    const approvedActive = () => {
        if (activeTab === TABS.approved) {
            return true;
        }
        return false;
    }

    const deniedActive = () => {
        if (activeTab === TABS.denied) {
            return true;
        }
        return false;
    }

    return (
        <div>
            <div className="tab-background-bar">
                <div className="tab-area">
                    <div onClick={activatePending} className={pendingActive() ? 'tab active-tab' : 'tab'}>
                        <h4>Pending</h4>
                        <span className={props.counts.pending ? 'count-badge' : 'hidden-badge'}>{props.counts.pending}</span>
                    </div>
                    <div onClick={activateApproved} className={approvedActive() ? 'tab active-tab' : 'tab'}>
                        <h4>Approved</h4>
                        <span className={props.counts.approved ? 'count-badge' : 'hidden-badge'}>{props.counts.approved}</span>
                    </div>
                    <div onClick={activateDenied} className={deniedActive() ? 'tab active-tab' : 'tab'}>
                        <h4>Denied</h4>
                        <span className={props.counts.denied ? 'count-badge' : 'hidden-badge'}>{props.counts.denied}</span>
                    </div>
                </div>
                
                <div className="filter-options-div">
                    <p>▼ Filter Options</p>
                </div>
            </div>
            <div className="card-area">
                {props.requests.length > 0 && props.requests.map(request =>
                    <RequestCard
                        key={request.id}
                        request={request}
                        forAdmin={props.reduxStore.adminMode}
                        past="false"
                    />
                )}
                {props.requests.length === 0 && (<span>[ No Requests ]</span>)}
            </div>
        </div>
    );
};

const mapReduxStoreToProps = reduxStore => ({
    reduxStore: reduxStore,
    employee: reduxStore.user.id,
    requests: reduxStore.requests_refactor,
    filters: reduxStore.requestFilters,
    counts: reduxStore.requestCounts
});

export default connect(mapReduxStoreToProps)(RequestTabs);