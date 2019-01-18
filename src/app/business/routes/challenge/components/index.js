import React from 'react';
import ReduxBase from '../../../common/components/base/redux';
import Detail from './detail';

import actions from '../actions';

const ChallengeBase = ReduxBase();

const download = {
    filename: 'metrics.py',
    address: ['metrics', 'storageAddress'],
    text: 'Download metrics',
};

const Challenge = () => <ChallengeBase actions={actions} model="challenge" download={download} Detail={Detail} />;

export default Challenge;
