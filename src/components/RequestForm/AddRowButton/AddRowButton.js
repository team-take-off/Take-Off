import React, { Component } from 'react';

class AddRowButton extends Component {

    // addDay = (event) => {
    //     counter++;
    //     console.log(this.state.requestForm);
    //     let itemToAdd = <div id={this.counter}><button onClick={this.subtractDay}>-</button>
    //         <input type="date" /></div>
    //     this.setState(this.props.prevState => ({
    //         this.props.requestForm: [...prevState.requestForm, itemToAdd]
    //     }))
    // }

    // Show this component on the DOM
    render() {
        return (
            <div>
                <button onClick={this.addDay}>+</button>
            </div>
        );
    }
}

export default AddRowButton;