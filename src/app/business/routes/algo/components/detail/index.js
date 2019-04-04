import React from 'react';

import Detail from '../../../../common/components/detail';
import Metadata from './components/metadata';
import Tabs from './components/tabs/redux';

const AlgoDetail = props => (
    <Detail
        {...props}
        Metadata={Metadata}
        Tabs={Tabs}
    />
);

export default AlgoDetail;
