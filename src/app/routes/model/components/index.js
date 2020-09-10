import React from 'react';

import actions from '../actions';

import Base from './base/redux';
import List from './list/redux';
import Detail from './detail/redux';

const Model = () => (
    <Base
        actions={actions}
        model="model"
        List={List}
        Detail={Detail}
    />
);

export default Model;
