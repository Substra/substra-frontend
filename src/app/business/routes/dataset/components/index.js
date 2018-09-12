import React from 'react';
import Base from '../../../common/components/base';

import actions from '../actions';

const download = {
    filename: 'opener.py',
    address: ['openerStorageAddress'],
    text: 'Download opener',
};

const Dataset = () => <Base actions={actions} model="dataset" download={download}/>;

export default Dataset;
