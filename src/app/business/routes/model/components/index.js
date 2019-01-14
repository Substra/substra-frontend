import React from 'react';

import actions from '../actions';

import ReduxBase from '../../../common/components/base/redux';

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
    />
);

export default Model;
