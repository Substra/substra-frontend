import React from 'react';
import PropTypes from 'prop-types';

import {
    BrowseRelatedLink,
    BrowseRelatedLinksWrapper,
} from '../../../../../common/components/detail/components/browseRelatedLinks';

const BrowseRelatedLinks = ({item}) => (
    <BrowseRelatedLinksWrapper>
        <BrowseRelatedLink model="algo" label="algorithm" filter={`name:${item.algo.name}`} />
        <BrowseRelatedLink model="challenge" label="challenge" filter={`hash:${item.challenge.hash}`} />
        <BrowseRelatedLink model="dataset" label="dataset" filter="dataset:dummy" />
    </BrowseRelatedLinksWrapper>
);

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
};

BrowseRelatedLinks.defaultProps = {
    item: {},
};

export default BrowseRelatedLinks;
