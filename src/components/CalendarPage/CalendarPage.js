import React, { Component } from 'react';

import BuildCalendar from './BuildCalendar';
import Nav from '../Nav/Nav';

class AdminCalendarPage extends Component {      
    // Show this component on the DOM
    render() {
        return (
            <>
                <Nav history={this.props.history} />
                <div>
                    <BuildCalendar requests={this.props.requests} />
                </div>
            </>
        );
    }
}

export default AdminCalendarPage;