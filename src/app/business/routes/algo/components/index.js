import React from 'react';
import ReduxBase from '../../../common/components/base/redux';
import Detail from './detail/redux';

import actions from '../actions';

const AlgoBase = ReduxBase();

const download = {
    filename: 'algo.tar.gz',
    address: ['content', 'storageAddress'],
    text: 'Download algo',
};

const Algo = () => <AlgoBase actions={actions} model="algo" download={download} Detail={Detail} />;

export default Algo;
