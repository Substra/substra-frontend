import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

const download = {
    filename: 'metrics.py',
    address: ['metrics', 'storageAddress'],
};

const Challenge = () => <Base actions={actions} model="challenge" download={download}/>;

export default Challenge;
