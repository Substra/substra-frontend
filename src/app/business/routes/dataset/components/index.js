import React from 'react';
import ReduxBase from '../../../common/components/base';

import actions from '../actions';

import List from './list';
import Detail from './detail';

const DatasetBase = ReduxBase();

const download = {
    filename: 'opener.py',
    address: ['openerStorageAddress'],
    text: 'Download opener',
};

const Dataset = () =>
    <DatasetBase
        actions={actions}
        model="dataset"
        download={download}
        List={List}
        Detail={Detail}
    />;

export default Dataset;
