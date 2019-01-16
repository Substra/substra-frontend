import React from 'react';

import actions from '../actions';

import Base from './base';
import List from './list';
import Detail from './detail';


const download = {
    filename: 'model',
    address: ['outModel', 'storageAddress'],
    text: 'Download outModel',
};

const Model = () => (
    <Base
        actions={actions}
        model="model"
        download={download}
        List={List}
        Detail={Detail}
    />
);

export default Model;
