import React from 'react';

import Sort from '../../../../../common/components/list/components/sort/redux';

const options = [
    {value: {by: 'traintuple.algo.name', direction: 'asc'}, label: 'ALGO NAME (A-Z)'},
    {value: {by: 'traintuple.algo.name', direction: 'desc'}, label: 'ALGO NAME (Z-A)'},
    {value: {by: 'traintuple.status', direction: 'asc'}, label: 'STATUS (DONE LAST)'},
    {value: {by: 'traintuple.status', direction: 'desc'}, label: 'STATUS (DONE FIRST)'},
];

export default (props) => <Sort {...props} options={options} />;
