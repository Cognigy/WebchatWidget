import React, { PropTypes as T } from 'react';

export default class RowNumber extends React.Component {

    render() {
        const style = { fontWeight: this.props.bold ? 700 : 'normal' };
        return (
            <div style={style} className="RowNumber">
                {this.props.rowNumber}
            </div>
        );
    }
}
