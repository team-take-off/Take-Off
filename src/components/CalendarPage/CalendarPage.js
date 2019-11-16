import React, { Component } from 'react';

import BuildCalendar from './BuildCalendar';
import Nav from '../Nav/Nav';

class CalendarPage extends Component {      
    render() {
        return (
            <>
                <Nav history={this.props.history} />
                <div>
                    <BuildCalendar />
                </div>
            </>
        );
    }
}

export default CalendarPage;