import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import './RequestTabs.css';
import RequestCard from '../RequestCard/RequestCard';
import RequestStatus from '../../classes/RequestStatus';

const RequestTabs = (props) => {
    const [activeTab, setActiveTab] = useState(RequestStatus.PENDING);
    const [filterOpen, setFilterOptions] = useState(false);

    useEffect(() => {
        if (props.forAdmin) {
            props.dispatch({ type: 'SET_FILTERS', payload: { employee: null, status: activeTab, startDate: null, endDate: null } });
        } else {
            props.dispatch({ type: 'SET_FILTERS', payload: { employee: props.employee, status: activeTab, startDate: null, endDate: null } });
        }
        props.dispatch({ type: 'FETCH_EMPLOYEES' });
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

    const toggleFilterPane = () => {
        setFilterOptions(!filterOpen);
    }

    const renderFilterOptions = (filters) => {
        let employeeParagraph = '';
        if (filters.employee && props.forAdmin) {
            let employee;
            for (let e of props.reduxStore.employees) {
                if (e.id === filters.employee) {
                    employee = e;
                    break;
                }
            }
            if (employee) {
                employeeParagraph = (<p>Employee: {employee.first_name} {employee.last_name}</p>);
            }
        }

        let datesParagraph = '';
        if (filters.startDate && filters.endDate) {
            const startMoment = moment(filters.startDate);
            const endMoment = moment(filters.endDate);
            datesParagraph = (<p>From {startMoment.format('LL')} to {endMoment.format('LL')}</p>);
        } else if (filters.endDate) {
            const endMoment = moment(filters.endDate);
            datesParagraph = (<p>Until {endMoment.format('LL')}</p>);
        } else if (filters.startDate) {
            const startMoment = moment(filters.startDate);
            datesParagraph = (<p>From {startMoment.format('LL')} forward</p>);
        } else {
            const currentMoment = moment();
            currentMoment.subtract(5, 'day');
            datesParagraph = (<p>From {currentMoment.format('LL')} forward</p>);
        }

        return (
            <>
                {employeeParagraph}
                {datesParagraph}
            </>
        );
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
                    <p onClick={toggleFilterPane} className="filter-link">▼ Filter Options</p>
                    {filterOpen &&
                        <div className="filter-options-pane">
                            <h3>Filter Options</h3>
                            {props.forAdmin &&
                                <p>Employee:</p>
                            }
                            <p>Year:</p>
                            <p>Vacation/Sick:</p>
                            <p onClick={toggleFilterPane} className="filter-link">Close</p>
                        </div>
                    }
                </div>
            </div>
            <div className="filter-display">
                {renderFilterOptions(props.filters)}
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
    requests: reduxStore.requests,
    filters: reduxStore.requestFilters,
    counts: reduxStore.requestCounts
});

export default connect(mapReduxStoreToProps)(RequestTabs);