import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

const ChallengeBase = Base();

const download = {
    filename: 'metrics.py',
    address: ['metrics', 'storageAddress'],
    text: 'Download metrics',
};

const Challenge = () => <ChallengeBase actions={actions} model="challenge" download={download} />;

export default Challenge;
