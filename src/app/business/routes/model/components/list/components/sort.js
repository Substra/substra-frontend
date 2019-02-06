import React from 'react';
import {ReduxSort} from '../../../../../common/components/list/components/sort';
import actions from '../../../actions';

const options = [
    {value: {by: 'testtuple.data.perf', direction: 'asc'}, label: 'LOWEST SCORE'},
    {value: {by: 'testtuple.data.perf', direction: 'desc'}, label: 'HIGHEST SCORE'},
];

export default () => <ReduxSort options={options} model="model" actions={actions} />;
