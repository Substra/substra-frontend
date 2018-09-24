import React from 'react';

import ReduxBase from '../../../common/components/base';

import actions from '../actions';

import Base from './base';
import List from './list';
import Detail from './detail';

const ReduxModelBase = ReduxBase(Base);

const download = {
    filename: 'model',
    address: ['endModel', 'storageAddress'],
    text: 'Download endModel',
};

const Model = () =>
    <ReduxModelBase
        actions={actions}
        model="model"
        download={download}
        List={List}
        Detail={Detail}
    />;

export default Model;
