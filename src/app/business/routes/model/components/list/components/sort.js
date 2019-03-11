import React from 'react';

import Sort from '../../../../../common/components/list/components/sort/redux';

const options = [
    {value: {by: 'testtuple.data.perf', direction: 'asc'}, label: 'LOWEST SCORE'},
    {value: {by: 'testtuple.data.perf', direction: 'desc'}, label: 'HIGHEST SCORE'},
];

export default props => <Sort {...props} options={options} />;
