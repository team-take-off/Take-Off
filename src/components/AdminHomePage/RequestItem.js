import React, {Component} from 'react';

class RequestItem extends Component {
    render() {
        return (
            <div>
                Date: {this.props.z.date}_____
                name: {this.props.z.first_name}_____
            </div>
        )
    }
}

export default RequestItem;