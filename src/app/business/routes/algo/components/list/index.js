import React from 'react';

import List from '../../../../common/components/list';
import Metadata from './components/metadata';

const AlgoList = props => (
    <List
        Metadata={Metadata}
        {...props}
    />
);

export default AlgoList;
