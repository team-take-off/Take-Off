import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import './RequestTabs.css';

const TABS = {
    pending: 1,
    approved: 2,
    denied: 3
};

const RequestTabs = (props) => {
    const [activeTab, setActiveTab] = useState(TABS.pending);
    const [counts, setCounts] = useState({ pending: null, approved: null, denied: null});

    useEffect(() => {
        fetchCounts();
    }, [counts]);

    const fetchCounts = async () => {
        try {
            const employee = props.reduxStore.user.id;
            const pending = await axios.get(`/api/request/count`, { params: { employee, status: 1 } });
            const approved = await axios.get(`/api/request/count`, { params: { employee, status: 2 } });
            const denied = await axios.get(`/api/request/count`, { params: { employee, status: 3 } });            
            await setCounts({ pending: pending.data.count, approved: approved.data.count, denied: denied.data.count });
        } catch(error) {
            await console.log(error);
            await alert('Unable to fetch request counts');
        };
    }

    const activatePending = () => {
        setActiveTab(TABS.pending);
    }

    const activateApproved = () => {
        setActiveTab(TABS.approved);
    }

    const activateDenied = () => {
        setActiveTab(TABS.denied);
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
                        <span className={counts.pending ? 'count-badge' : 'hidden-badge'}>{counts.pending}</span>
                    </div>
                    <div onClick={activateApproved} className={approvedActive() ? 'tab active-tab' : 'tab'}>
                        <h4>Approved</h4>
                        <span className={counts.approved ? 'count-badge' : 'hidden-badge'}>{counts.approved}</span>
                    </div>
                    <div onClick={activateDenied} className={deniedActive() ? 'tab active-tab' : 'tab'}>
                        <h4>Denied</h4>
                        <span className={counts.denied ? 'count-badge' : 'hidden-badge'}>{counts.denied}</span>
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