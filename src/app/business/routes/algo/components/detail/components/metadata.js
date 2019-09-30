import React from 'react';
import BaseMetadata, {
    MetadataWrapper,
    KeyMetadata,
    BrowseRelatedMetadata, PermissionsMetadata, OwnerMetadata,
} from '../../../../../common/components/detail/components/metadata';
import BrowseRelatedLinks from './browseRelatedLinks';


const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.key} addNotification={addNotification} model={model} />
        <OwnerMetadata owner={item.owner} />
        <PermissionsMetadata permissions={item.permissions} />
        <BrowseRelatedMetadata>
            <BrowseRelatedLinks item={item} />
        </BrowseRelatedMetadata>
    </MetadataWrapper>
);

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
