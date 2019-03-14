import React, {Component} from 'react';

class RequestItem extends Component {
    render() {
        return (
            <div>
                Date: {this.props.z.date}
            </div>
        )
    }
}

export default RequestItem;