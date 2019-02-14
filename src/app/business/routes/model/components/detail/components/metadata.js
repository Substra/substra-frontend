import React from 'react';
import BaseMetadata, {SingleMetadata, KeyMetadata, MetadataWrapper} from '../../../../../common/components/detail/components/metadata';

const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.traintuple.key} addNotification={addNotification} model={model} />
        <SingleMetadata label="Status" value={item.traintuple.status} />
        {item.testtuple && <SingleMetadata label="Score" value={`${item.testtuple.data.perf}`} />}
    </MetadataWrapper>
);

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
