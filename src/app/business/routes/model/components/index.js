import React from 'react';

import actions from '../actions';

import List from './list';
import Detail from './detail';
import ReduxBase from './base/redux';

const ReduxModelBase = ReduxBase();

const download = {
    filename: 'model',
    address: ['endModel', 'storageAddress'],
    text: 'Download endModel',
};

const Model = () => (
    <ReduxModelBase
        actions={actions}
        model="model"
        download={download}
        List={List}
        Detail={Detail}
    />
);

export default Model;
