import React from 'react';

import Detail from '../../../../common/components/detail/redux';
import Metadata from './components/metadata';
import Description from './components/description';


export default props => (
    <Detail
        {...props}
        Metadata={Metadata}
        Description={Description}
    />
);
