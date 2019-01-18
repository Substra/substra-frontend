import React from 'react';

import {
    KeyMetadata, MetadataInterface,
    MetadataWrapper,
    SingleMetadata,
} from '../../../../../common/components/detail/components/metadata';

const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item={item} addNotification={addNotification} model={model} />
        <SingleMetadata label="Metric" value={item.metrics.name} />
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
