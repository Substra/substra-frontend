import React from 'react';
import BrowseRelatedLinks from './browseRelatedLinks';

import {
    KeyMetadata,
    BrowseRelatedMetadata,
    MetadataInterface,
    MetadataWrapper,
} from '../../../../../common/components/detail/components/metadata';

const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.key} addNotification={addNotification} model={model} />
        <BrowseRelatedMetadata>
            <BrowseRelatedLinks item={item} />
        </BrowseRelatedMetadata>
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
