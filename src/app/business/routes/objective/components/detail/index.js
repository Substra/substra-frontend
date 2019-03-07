import React from 'react';

import Detail from '../../../../common/components/detail/redux';
import Metadata from './components/metadata';

export default props => (
    <Detail
        Metadata={Metadata}
        {...props}
    />
);
