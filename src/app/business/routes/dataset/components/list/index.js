import React from 'react';

import List from '../../../../common/components/list';
import Actions from './components/actions';

const DatasetList = props => (
    <List
        Actions={Actions}
        {...props}
    />
);

export default DatasetList;
