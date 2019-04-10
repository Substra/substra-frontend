import React from 'react';

import Sort from '../../../../../common/components/list/components/sort/redux';

const options = [
    {value: {by: 'testtuple.dataset.perf', direction: 'asc'}, label: 'LOWEST SCORE'},
    {value: {by: 'testtuple.dataset.perf', direction: 'desc'}, label: 'HIGHEST SCORE'},
];

export default props => <Sort {...props} options={options} />;
