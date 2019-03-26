import React from 'react';
import ReduxBase from '../../../common/components/base/redux';
import Detail from './detail';
import List from './list';
import actions from '../actions';

const ObjectiveBase = ReduxBase();

const download = {
    filename: 'metrics.py',
    address: ['metrics', 'storageAddress'],
    text: 'Download metrics',
};

const Objective = () => (
    <ObjectiveBase
        actions={actions}
        model="objective"
        download={download}
        List={List}
        Detail={Detail}
    />
);

export default Objective;
