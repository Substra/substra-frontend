import React from 'react';

import ReduxBase, {Base} from '../../../common/components/base';

import actions from '../actions';

import B from './base';
import List from './list';
import Detail from './detail';


const ModelBase = ReduxBase(Base(List, Detail)(B));

const download = {
    filename: 'model',
    address: ['endModel', 'storageAddress'],
    text: 'Download endModel',
};

const Model = () => <ModelBase actions={actions} model="model" download={download}/>;

export default Model;
