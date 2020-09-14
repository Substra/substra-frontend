import React from 'react';
import ReduxBase from '../../../common/components/base/redux';
import Detail from './detail/redux';
import List from './list/redux';

import actions from '../actions';

const AlgoBase = ReduxBase();

const download = {
    filename: 'algo.tar.gz',
    address: ['content', 'storage_address'],
    text: 'Download algo',
};

const Algo = () => (
    <AlgoBase
        actions={actions}
        model="algo"
        download={download}
        Detail={Detail}
        List={List}
    />
);

export default Algo;
