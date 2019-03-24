import React, { Component } from 'react';

import './VacationDaysHeading.css';

class SickDaysHeading extends Component {
    render() {
        return (
            <div>
                <h2>Vacation: <span className="vacation-days-span">{this.props.days} days</span></h2>
            </div>
        );
    }
}

export default SickDaysHeading;