import React from 'react';
import DefaultReduxURLSyncedSort, {ReduxURLSyncedSort} from '../../../../../common/components/list/components/sort';

const options = [
    {value: {by: 'testtuple.data.perf', direction: 'asc'}, label: 'LOWEST SCORE'},
    {value: {by: 'testtuple.data.perf', direction: 'desc'}, label: 'HIGHEST SCORE'},
];

const ModelSort = ({model, actions}) => <ReduxURLSyncedSort options={options} model={model} actions={actions} />;

ModelSort.propTypes = DefaultReduxURLSyncedSort.propTypes;

export default ModelSort;
