import React, { Component } from 'react';

import './SickDaysHeading.css';

class SickDaysHeading extends Component {
    render() {
        return (
            <div>
                <h2>Sick & Safe Time: <span className="sick-days-span">{this.props.days} days</span></h2>
            </div>
        );
    }
}

export default SickDaysHeading;