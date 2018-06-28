import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';


import {coolBlue} from "../../../../../../assets/css/variables";
import PulseLoader from "../../../common/components/presentation/loaders/PulseLoader";

class List extends Component {
    render() {
        const {results, loading, className} = this.props;

        // TODO put in reselect
        const columns = results.length ? Object.keys(results[0]).filter(o => o !== 'docType') : [];

        return <div className={className}>
            {loading && <PulseLoader size={6} color={coolBlue}/>}
            {!loading && !results.length && <p>There is no items</p>}
            {!loading && results.length ?
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox/>
                            </TableCell>
                            {columns.map(x =>
                                <TableCell key={`head-${x}`}>
                                    <TableSortLabel>
                                        {x}
                                    </TableSortLabel>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map(o =>
                            <TableRow key={o.key}>
                                <TableCell>
                                    <Checkbox/>
                                </TableCell>
                                {columns.map(x =>
                                    <TableCell key={`body-${o.key}-${x}`}>
                                        {o[x]}
                                    </TableCell>
                                )}
                            </TableRow>)
                        }
                    </TableBody>
                </Table> : null}
        </div>
    }
}

export default List;
