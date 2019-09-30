import React from 'react';

import {
    KeyMetadata,
    BrowseRelatedMetadata,
    MetadataInterface,
    MetadataWrapper,
    SingleMetadata, PermissionsMetadata, OwnerMetadata,
} from '../../../../../common/components/detail/components/metadata';
import BrowseRelatedLinks from './browseRelatedLinks';

const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.key} addNotification={addNotification} model={model} />
        <SingleMetadata label="Metric" value={item.metrics.name} />
        <OwnerMetadata owner={item.owner} />
        <PermissionsMetadata permissions={item.permissions} />
        <BrowseRelatedMetadata>
            <BrowseRelatedLinks item={item} />
        </BrowseRelatedMetadata>
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
