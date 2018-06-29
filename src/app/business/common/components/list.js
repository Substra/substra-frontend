import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {coolBlue} from "../../../../../assets/css/variables/index";
import PulseLoader from "./presentation/loaders/PulseLoader";

import Row from './table/row';

import {getColumns, getOrderedResults} from '../../routes/problem/selector';


class List extends Component {
    constructor(props) {
        super(props);

        // load items
        if (!props.init && typeof window !== 'undefined') {
            props.fetchList();
        }
    }

    isSelected = (key) => this.props.selected.includes(key);

    onSelectAllClick = (event, checked) => {
        const {results, setSelected} = this.props;

        setSelected(checked ? results.map(o => o.key) : []);
    };

    setSelected = key => {
        const {selected, setSelected} = this.props;

        setSelected(selected.includes(key) ? selected.filter(o => o !== key) : [...selected, key]);
    };

    createSortHandler = (by) => e => {
        const {order, setOrder} = this.props;

        const direction = order.by === by && order.direction === 'desc' ? 'asc' : 'desc';

        setOrder({direction, by});
    };

    render() {
        const {results, selected, init, loading, className, columns, order} = this.props;
        const rowCount = results.length,
            numSelected = selected.length;

        return <div className={className}>
            {loading && <PulseLoader size={6} color={coolBlue}/>}
            {init && !loading && !results.length && <p>There is no items</p>}
            {init && !loading && results.length &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={numSelected === rowCount}
                                    onChange={this.onSelectAllClick}
                                />
                            </TableCell>
                            {columns.map(x =>
                                <TableCell key={`head-${x}`}
                                           numeric={true}
                                           sortDirection={order.by === x ? order.direction : false}>
                                    <TableSortLabel
                                        active={order.by === x}
                                        direction={order.direction}
                                        onClick={this.createSortHandler(x)}>
                                        {x}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map(o =>
                            <Row
                                key={o.key}
                                isSelected={this.isSelected(o.key)}
                                item={o}
                                columns={columns}
                                setSelected={this.setSelected}/>
                        )}
                    </TableBody>
                </Table>}
        </div>
    }
}

const mapStateToProps = (state, {model}) => ({
    init: state[model].list.init,
    loading: state[model].list.loading,
    results: getOrderedResults(state, model),
    selected: state[model].list.selected,
    order: state[model].order,
    columns: getColumns(state, model),
});

const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(List);
