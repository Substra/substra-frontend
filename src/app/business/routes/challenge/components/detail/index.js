import React from 'react';

import Detail from '../../../../common/components/detail/redux';
import BrowseRelatedLinks from './components/browseRelatedLinks';
import Metadata from './components/metadata';

export default props => (
    <Detail
        BrowseRelatedLinks={BrowseRelatedLinks}
        Metadata={Metadata}
        {...props}
    />
);
