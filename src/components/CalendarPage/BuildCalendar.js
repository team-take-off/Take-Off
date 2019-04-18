import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';


moment.locale('en');
BigCalendar.momentLocalizer(moment);

class BuildAdminCalendar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            calendar_events: [],
        }
      }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.requests !== this.props.requests) {
            // console.log(this.props.requests);
            const requests = this.props.requests;
            let filteredRequest = []
            const batchIDs = this.filterUniqueBatchIDs(requests);
            let requestBatchArray;
            for (let id of batchIDs) {
                // Sort requests into batches based on their 'batch_of_requests_id'
                // Also ignores any requests that are not 'pending' or 'approved'
                requestBatchArray = requests.filter(
                    (request) => {
                        if (request.batch_of_requests_id === id && (request.status === 'pending' || request.status === 'approved')) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                );
                filteredRequest.push(requestBatchArray)
            }
            
            for (let requestArray of filteredRequest) {

                requestArray.sort((a,b) => {

                    a = moment(a.date);
                    b = moment(b.date);
                    // return a<b ? -1 : a>b ? 1 : 0;
                    return a.diff(b);
                }) 
                if (requestArray.length === 0) {
                    continue;
                }
                
                const firstRequest = requestArray[0];
                const lastRequest = requestArray[requestArray.length - 1];
                // console.log('start leave: ', moment.utc(firstRequest.date).toDate());
                // console.log('end leave: ', moment.utc(lastRequest.date).toDate());
                
                this.setState(prevState => ({
                    calendar_events: [
                        ...prevState.calendar_events, 
                        {
                            title: `${firstRequest.first_name}: ${firstRequest.type}`,
                            start: moment.utc(firstRequest.date).toDate(),
                            end: moment(moment.utc(lastRequest.date).toDate()).add(1, 'day'),
                        }
                    ],
                })) // end of setState
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

    eventStyle = (event, start, end, isSelected) => {
        // console.log(event);
        
        var backgroundColor = event.title.includes('Vacation') ? '#88BB92' : '#F7934C';
        var style = {
            backgroundColor: backgroundColor
        };
        return {
        style: style
        };
    }
        
      
    // Show this component on the DOM
    render() {
        // console.log('current state', this.state.calendar_events);
        const localizer = BigCalendar.momentLocalizer(moment);
    return (
      <div>
          {/* {JSON.stringify(this.props.requests)} */}
            <div style={{ height: '100vh' }}>
                <BigCalendar
                    localizer={localizer}
                    events={this.state.calendar_events}
                    step={30}
                    defaultView='month'
                    views={['month']}
                    eventPropGetter={(this.eventStyle)}
                    // defaultDate={new Date()}
                />
            </div>
        </div>
        );
    }
}
export default BuildAdminCalendar;