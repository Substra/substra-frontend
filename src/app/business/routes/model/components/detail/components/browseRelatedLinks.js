import React from 'react';
import PropTypes from 'prop-types';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';
import BrowseRelatedLinksWrapper from '../../../../../common/components/detail/components/browseRelatedLinksWrapper';

const BrowseRelatedLinks = ({item, ...props}) => {
    const algoFilter = `algo:name:${item ? item.name : ''}`;
    const challengeFilter = `challenge:key:${item && item.challenge ? item.challenge.hash : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
            <BrowseRelatedLink model="algo" label="algorithm" filter={algoFilter} />
            <BrowseRelatedLink model="challenge" label="challenge" filter={challengeFilter} />
            <BrowseRelatedLink model="dataset" label="dataset" filter={challengeFilter} />
        </BrowseRelatedLinksWrapper>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
};

BrowseRelatedLinks.defaultProps = {
    item: null,
};

export default BrowseRelatedLinks;
