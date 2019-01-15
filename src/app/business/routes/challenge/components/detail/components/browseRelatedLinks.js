import React from 'react';
import PropTypes from 'prop-types';

import {
    BrowseRelatedLink,
    BrowseRelatedLinksWrapper,
} from '../../../../../common/components/detail/components/browseRelatedLinks';

const BrowseRelatedLinks = ({item}) => {
    const filter = `challenge:name:${item.name}`;

    return (
        <BrowseRelatedLinksWrapper>
            <BrowseRelatedLink model="dataset" label="dataset" filter={filter} />
            <BrowseRelatedLink model="algo" label="algorithms" filter={filter} />
            <BrowseRelatedLink model="model" label="models" filter={filter} />
        </BrowseRelatedLinksWrapper>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
};

BrowseRelatedLinks.defaultProps = {
    item: {},
};

export default BrowseRelatedLinks;
