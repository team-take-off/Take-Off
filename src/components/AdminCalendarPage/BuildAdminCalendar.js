import React, { Component } from 'react';
import DateRange from '../../modules/DateRange';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// moment.locale('en-GB');
BigCalendar.momentLocalizer(moment);

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            calendar_events: [{start: '', end: ''}],
        }
      }
    configureEvent = () => {

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requests !== this.props.requests) {
            // console.log(this.props.requests);
            const requests = this.props.requests;

            const batchIDs = this.filterUniqueBatchIDs(requests);
            
            for (let id of batchIDs) {
                // Sort requests into batches based on their 'batch_of_requests_id'
                const requestBatchArray = requests.filter(
                    request => request.batch_of_requests_id === id
                );
                console.log(Date(requestBatchArray[0].date));
                console.log(moment.utc(requestBatchArray[0].date).toDate());
                console.log(moment.utc(requestBatchArray[requestBatchArray.length-1].date).toDate());
                
                
                console.log(requestBatchArray);
                for (let i = 0; i < requestBatchArray.length; i++) {
                    const element = requestBatchArray[i];
                    if (i === 0) {
                        this.setState(prevState => ({
                            calendar_events: [{
                                ...prevState.end,
                                start: moment.utc(element.date).toDate()
                            }]
                        }))
                    } else if (i === requestBatchArray.length-1) {
                        this.setState(prevState =>({
                            calendar_events: [{
                                ...prevState.start,
                                end: moment.utc(element.date).toDate(),
                            }]
                        }))
                    

                    }
                    
                    
                }
                console.log('current state', this.state.calendar_events);
                    // this.setState({
                    //     calendar_events: [{
                    //         start: moment.utc(requestBatchArray[0].date).toDate(),
                    //         end: moment.utc(requestBatchArray[requestBatchArray.length-1].date).toDate(),
                    //         title: requestBatchArray[0].first_name,
                    //     }]
                    // })
                
                
            }
            
        
        }
    }
        
      // Returns an array with unique batch_of_request_id
    filterUniqueBatchIDs = (requests) => {
        let uniqueObject = {};
        for (let request of requests) {
            uniqueObject[request.batch_of_requests_id] = 1;
        }
        let uniqueArray = [];
        for (let id in uniqueObject) {
            uniqueArray.push(parseInt(id));
        }
        return uniqueArray;
    }
        
      
    // Show this component on the DOM
    render() {
        const localizer = BigCalendar.momentLocalizer(moment);
    return (
      <div>
            <div style={{ height: 700 }}>
                <BigCalendar
                    localizer={localizer}
                    events={this.state.calendar_events}
                    step={30}
                    defaultView='month'
                    views={['month']}
                    defaultDate={new Date()}
                />
            </div>
        </div>
        );
    }
}
export default BuildAdminCalendar;