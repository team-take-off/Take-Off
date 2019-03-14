import React, {Component} from 'react';

class RequestItem extends Component {
    render() {
        return (
            <div>
                name:{this.props.z.first_name}
            </div>
        )
    }
}

export default RequestItem;