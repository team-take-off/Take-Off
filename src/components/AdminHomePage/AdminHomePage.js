import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import RequestItem from './RequestItem';
class AdminHomePage extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_REQUESTS'})
    }
    // Show this component on the DOM
    render() {
        return (
            <div>
                {JSON.stringify(this.props.requests[0])}
                {console.log(moment().format('YYYY-MM-DD'))
                }
                <h2>Approved Requests</h2>
                
                <div>
                    {this.props.requests && this.props.requests.length > 0  && (
                        this.props.requests.filter(x => 
                                moment(x.date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')
                        ).map(z => 
                            <RequestItem z={z} />
                            )
                    )}
                    
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    requests: state.requests
});
export default connect(mapStateToProps)(AdminHomePage);