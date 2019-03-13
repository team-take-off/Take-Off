import React, { Component } from 'react';
import { connect } from 'react-redux';
// import axios from 'axios';

class VacationRequestPageItem extends Component {

    constructor() {
        super()
    }

    subtractDay = (event) => {
        console.log('index', this.props.i);

        //  console.log('index', index);
        this.props.removeDay(this.props.i)
        
    }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <button onClick={this.subtractDay}>-</button>{this.props.item}    
            </div>
        );
    }
}

const mapStateToProps = reduxStore => ({
    reduxStore
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(VacationRequestPageItem);