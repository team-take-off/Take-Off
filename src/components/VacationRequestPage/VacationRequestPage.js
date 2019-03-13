import React, { Component } from 'react';
import { connect } from 'react-redux';
import RequestForm from '../RequestForm/RequestForm';
// import axios from 'axios';

class VacationRequestPage extends Component {

    componentDidMount() {
        this.addUserInfo();
        
    }

    addUserInfo = (event) => {
        const action = { type: 'SET_USER_INFO', payload: this.props.reduxStore.user }
        this.props.dispatch(action)
    }

    addDay = (event) => {

        
        let itemToAdd = <input type="date" />
        this.setState(prevState => ({
            requestForm: [...prevState.requestForm, itemToAdd]
        }))

        
    }



     removeDay = (day) =>{
         
        // this.setState({
        //     requestForm: this.state.requestForm.filter((_, i) => i !== day)
        // });
        
        
    }
    
    // Show this component on the DOM
    render() {
        // console.log(this.state.requestForm);
        // let firstDay = <div><button onClick={this.subtractDay}>-</button><input type="date" /></div>
        return (
            <div>
                <h2>Vacation Time: {(parseFloat(this.props.reduxStore.userInfo.vacation_hours) / 8)} Days</h2>
                <RequestForm type={1} />
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(VacationRequestPage);