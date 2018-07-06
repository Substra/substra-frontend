import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {onlyUpdateForKeys} from 'recompose';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

class Row extends Component {
    handleClick = (e) => {
        const {item: {key}, setSelected} = this.props;
        setSelected(key);
    };

    render() {
        const {item, columns, isSelected} = this.props;

        return (
            <TableRow
                onClick={this.handleClick}
                selected={isSelected}
            >
                <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                </TableCell>
                {columns.map(x => (
                    <TableCell key={`body-${item.key}-${x}`}>
                        {item[x]}
                    </TableCell>),
                )}
            </TableRow>);
    }
}

const noop = () => {};

Row.defaultProps = {
    item: {},
    columns: [],
    isSelected: false,
    setSelected: noop,
};

Row.propTypes = {
    item: PropTypes.shape({}),
    columns: PropTypes.arrayOf(PropTypes.string),
    isSelected: PropTypes.bool,
    setSelected: PropTypes.func,
};

export default onlyUpdateForKeys(['item', 'columns', 'isSelected'])(Row);
