import React from 'react';
import BaseMetadata, {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName,
    BrowseRelatedMetadata,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import BrowseRelatedLinks from './browseRelatedLinks';


const Metadata = ({item, addNotification}) => (
    <MetadataWrapper>
        <SingleMetadata
            label="Traintuple key"
            labelClassName={keyLabelClassName}
            valueClassName={keyValueClassName}
        >
            <CopyInput
                value={item.traintuple.key}
                addNotification={addNotification(item.traintuple.key, 'Traintuple\'s key successfully copied to clipboard!')}
            />
        </SingleMetadata>
        {item.traintuple.outModel && (
            <SingleMetadata
                label="Model key"
                labelClassName={keyLabelClassName}
                valueClassName={keyValueClassName}
            >
                <CopyInput
                    value={item.traintuple.outModel.hash}
                    addNotification={addNotification(item.traintuple.outModel.hash, 'Model\'s key successfully copied to clipboard!')}
                />
            </SingleMetadata>
        )}
        {!item.traintuple.outModel && (
            <SingleMetadata label="Model key" value="N/A" />
        )}
        <SingleMetadata label="Status" value={item.traintuple.status} />
        {item.testtuple && item.testtuple.status === 'done' && <SingleMetadata label="Score" value={`${item.testtuple.data.perf}`} />}
        <BrowseRelatedMetadata>
            <BrowseRelatedLinks item={item} />
        </BrowseRelatedMetadata>
    </MetadataWrapper>
);

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
