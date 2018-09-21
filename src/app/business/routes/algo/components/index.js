import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

const AlgoBase = Base();

const download = {
    filename: 'algo.tar.gz',
    address: ['storageAddress'],
    text: 'Download algo tarball',
};

const Algo = () => <AlgoBase actions={actions} model="algo" download={download} />;

export default Algo;
