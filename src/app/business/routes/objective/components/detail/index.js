import React from 'react';

import Detail from '../../../../common/components/detail';
import Metadata from './components/metadata';
import Tabs from './components/tabs/redux';

const ObjectiveDetail = props => (
    <Detail
        {...props}
        Metadata={Metadata}
        Tabs={Tabs}
    />
);

export default ObjectiveDetail;
