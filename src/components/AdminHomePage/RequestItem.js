import React, {Component} from 'react';

class RequestItem extends Component {
    render() {
        return (
            <div>
                Date: {this.props.z.date}_____
                name: {this.props.z.first_name}_____
                batch id: {this.props.z.batch_of_requests_id}
            </div>
        )
    }
}

export default RequestItem;