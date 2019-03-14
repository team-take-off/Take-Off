import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class AdminHomePage extends Component {
    componentDidMount() {
        this.props.dispatch({type: 'FETCH_REQUESTS'});
    }

    groupBatchIds = () => {
        let arrayOfCards = [];
        for (const id of this.props.reduxStore.requests) {
            const requestDatesArrary = this.props.reduxStore.requests.filter(x => 
                id.id === x.batch_of_requests_id
                )
                console.log(requestDatesArrary);
              console.log(moment((requestDatesArrary[requestDatesArrary.length-1]).date).format('YYYY-MM-DD'))
        }
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

const mapReduxStoreToProps = reduxStore => ({
    reduxStore
});

export default connect(mapReduxStoreToProps)(AdminHomePage);