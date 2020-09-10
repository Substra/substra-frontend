import React from 'react';
import ReduxBase from '../../../common/components/base/redux';

import actions from '../actions';

import List from './list/redux';
import Detail from './detail/redux';

const DatasetBase = ReduxBase();

const download = {
    filename: 'opener.py',
    address: ['opener', 'storageAddress'],
    text: 'Download opener',
};

const Dataset = () => (
    <DatasetBase
        actions={actions}
        model="dataset"
        download={download}
        List={List}
        Detail={Detail}
    />
);

export default Dataset;
