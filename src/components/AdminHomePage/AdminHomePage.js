import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import RequestItem from './RequestItem';
class AdminHomePage extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_REQUESTS'});
        this.props.dispatch({type: 'BATCH_OF_REQUESTS'});
    }
    // Show this component on the DOM
    render() {
        return (
            <div>
                {/* {JSON.stringify(this.props.requests[0])} */}
                {/* {console.log(moment().format('YYYY-MM-DD')) */}
                {JSON.stringify(this.props.requests.batchOfRequests)}
                }
                <h2>Past Requests</h2>
                
                <div>
                    {/* {this.props.requests && this.props.requests.length > 0  && (
                        this.props.requests.filter(x => 
                            moment(x.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
                        ).map(z => 
                            <RequestItem z={z} />
                            )
                    )} */}
                    {this.props.requests.requests && this.props.requests.requests.length > 0  && (
                        this.props.requests.requests.filter(i =>
                            i.batch_of_requests_id
                        ).map(z => 
                            <RequestItem z={z} />
                            )
                    )}
                    {/* {this.props.requests && this.props.requests.length > 0  && (
                        this.props.requests.map(z => 
                            if (z.batch_of_requests_id === z.batch_of_requests_id) {
                                
                            }
                        
                            
                    )} */}
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    requests: state.requests
});
export default connect(mapStateToProps)(AdminHomePage);