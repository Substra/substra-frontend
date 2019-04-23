import React from 'react';

import actions from '../actions';

import Base from './base/redux';
import List from './list/redux';
import Detail from './detail/redux';


const download = {
    filename: 'model',
    address: ['traintuple', 'outModel', 'storageAddress'],
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
