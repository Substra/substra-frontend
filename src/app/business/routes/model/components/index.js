import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

import List from './list';
import Detail from './detail';

const ModelBase = Base(List, Detail);

const download = {
    filename: 'model',
    address: ['endModel', 'storageAddress'],
    text: 'Download endModel',
};

const Model = () => <ModelBase actions={actions} model="model" download={download} />;

export default Model;
