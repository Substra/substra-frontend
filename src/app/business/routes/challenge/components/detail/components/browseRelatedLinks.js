import React from 'react';
import PropTypes from 'prop-types';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';
import BrowseRelatedLinksWrapper from '../../../../../common/components/detail/components/browseRelatedLinksWrapper';

const BrowseRelatedLinks = ({item, ...props}) => {
    const filter = `challenge:name:${item ? item.name : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
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
    item: null,
};

export default BrowseRelatedLinks;
