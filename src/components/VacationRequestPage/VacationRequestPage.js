import React, { Component } from 'react';
import { connect } from 'react-redux';
import VacationRequestPageItem from './VacationRequestPageItem';
// import axios from 'axios';

class VacationRequestPage extends Component {

    constructor() {

        super()
        this.state={
            requests:[],
            requestForm:[],
        }
    }

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
         
        this.setState({
            requestForm: this.state.requestForm.filter((_, i) => i !== day)
        });
        
        
    }
    
    // Show this component on the DOM
    render() {
        console.log('array', this.state.requestForm);
        // console.log(this.state.requestForm);
        // let firstDay = <div><button onClick={this.subtractDay}>-</button><input type="date" /></div>
        return (
            <div>
                <h2>Vacation Time: {(parseFloat(this.props.reduxStore.userInfo.vacation_hours) / 8)} Days</h2>
                <div><button onClick={this.subtractDay}>-</button><input type="date" /></div>
                {/* {firstDay} */}
                {this.state.requestForm.map((item,i) => {
                    return <VacationRequestPageItem removeDay={this.removeDay} item={item} i={i}requestForm={this.state.requestForm}/>
                })}
            <button onClick={this.addDay}>+</button>
            <br></br>
            <button>Submit</button>
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(VacationRequestPage);