import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

const download = {
    filename: 'algo.tar.gz',
    address: ['storageAddress'],
};

const Algo = () => <Base actions={actions} model="algo" download={download}/>;

export default Algo;
