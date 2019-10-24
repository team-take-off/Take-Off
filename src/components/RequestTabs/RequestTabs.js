import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './RequestTabs.css';
import RequestCard from '../RequestCard/RequestCard';
import RequestStatus from '../../classes/RequestStatus';

const RequestTabs = (props) => {
    const [activeTab, setActiveTab] = useState(RequestStatus.PENDING);

    useEffect(() => {
        if (props.forAdmin) {
            props.dispatch({ type: 'SET_FILTERS', payload: { employee: null, status: activeTab, year: null } });
        } else {
            props.dispatch({ type: 'SET_FILTERS', payload: { employee: props.employee, status: activeTab, year: null } });
        }
    }, []);

    const activatePending = () => {
        setActiveTab(RequestStatus.PENDING);
        props.dispatch({ type: 'SET_STATUS_FILTER', payload: RequestStatus.PENDING });
    }

    const activateApproved = () => {
        setActiveTab(RequestStatus.APPROVED);
        props.dispatch({ type: 'SET_STATUS_FILTER', payload: RequestStatus.APPROVED });
    }

    const activateDenied = () => {
        setActiveTab(RequestStatus.DENIED);
        props.dispatch({ type: 'SET_STATUS_FILTER', payload: RequestStatus.DENIED });
    }

    const pendingActive = () => {
        if (activeTab === RequestStatus.PENDING) {
            return true;
        }
        return false;
    }
    
    const approvedActive = () => {
        if (activeTab === RequestStatus.APPROVED) {
            return true;
        }
        return false;
    }

    const deniedActive = () => {
        if (activeTab === RequestStatus.DENIED) {
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
                        forAdmin={props.forAdmin}
                        past={false}
                    />
                )}
                {props.requests.length === 0 && (<span className="no-requests-span">[ No requests in this category ]</span>)}
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