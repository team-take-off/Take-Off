import React, { Component } from 'react';
import {connect} from 'react-redux';
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
                <h2>Pending Requests</h2>
                
                <div>
                    {this.props.requests && this.props.requests.length > 0  && (
                        this.props.requests.filter(x => 
                                x.approved === true
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