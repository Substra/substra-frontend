import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import actions from '../actions';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {coolBlue} from "../../../../../../assets/css/variables";
import PulseLoader from "../../../common/components/presentation/loaders/PulseLoader";

import Row from './table/row';

import {getColumns, getOrderedResults} from '../selector';


class List extends Component {
    constructor(props) {
        super(props);

        // load items
        if (!props.init && typeof window !== 'undefined') {
            props.fetchList();
        }
    }

    onSelectAllClick = (event, checked) => {
        const {results, setSelected} = this.props;

        setSelected(checked ? results.map(o => o.key) : []);
    };

    isSelected = (key) => this.props.selected.includes(key);

    handleClick = (key) => {
        const {selected} = this.props;
        const checked = selected.includes(key);

        let newSelected = [];

        // remove it
        if (checked) {
            newSelected = selected.filter(o => o !== key);
        }
        // add it
        else {
            newSelected = [...selected, key];
        }

        this.props.setSelected(newSelected);
    };

    setSelected = key => {
        const {selected} = this.props;

        const newSelected = selected.includes(key) ? selected.filter(o => o !== key) : [...selected, key];

        this.props.setSelected(newSelected);
    };

    createSortHandler = (property) => e => {
        const by = property;
        let direction = 'desc';

        if (this.props.order.by === property && this.props.order.direction === 'desc') {
            direction = 'asc';
        }

        this.props.setOrder({direction, by});
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

const mapStateToProps = state => ({
    init: state.problem.list.init,
    loading: state.problem.list.loading,
    results: getOrderedResults(state),
    selected: state.problem.list.selected,
    order: state.problem.order,
    columns: getColumns(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchList: actions.list.request,
    setSelected: actions.list.selected,
    setOrder: actions.order.set
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(List);
