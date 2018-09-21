import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

import List from './list';
import Detail from './detail';

const DatasetBase = Base(List, Detail);

const download = {
    filename: 'opener.py',
    address: ['openerStorageAddress'],
    text: 'Download opener',
};

const Dataset = () => <DatasetBase actions={actions} model="dataset" download={download} />;

export default Dataset;
