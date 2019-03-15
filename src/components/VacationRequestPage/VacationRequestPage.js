import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestForm from '../RequestForm/RequestForm';

class VacationRequestPage extends Component {

    componentDidMount() {
        this.props.dispatch({type: 'FETCH_USER_INFO'});
    }


    render() {
        return (
            <div>
                {this.props.reduxStore.userInfo && this.props.reduxStore.userInfo.length > 0 && (
                    <div>
                        <h2>Vacation Time: {(parseFloat(this.props.reduxStore.userInfo[0].vacation_hours) / 8)} Days</h2>
                        <RequestForm history={this.props.history} type={1} />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(VacationRequestPage);