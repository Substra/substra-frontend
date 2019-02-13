import React from 'react';
import BaseMetadata, {SingleMetadata, KeyMetadata, MetadataWrapper} from '../../../../../common/components/detail/components/metadata';

const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item={item} addNotification={addNotification} model={model} />
        <SingleMetadata label="Status" value={item.status} />
        <SingleMetadata label="Score" value={`${item.data.perf}`} />
    </MetadataWrapper>
);

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
