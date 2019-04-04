import React, {Fragment} from 'react';
import {capitalize} from 'lodash';

import BaseMetadata, {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName,
    BrowseRelatedMetadata,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import BrowseRelatedLinks from './browseRelatedLinks';
import InlinePulseLoader from '../../inlinePulseLoader';


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
        <SingleMetadata label="Status">
            {capitalize(item.traintuple.status)}
            <InlinePulseLoader loading={['todo', 'doing'].includes(item.traintuple.status)} />
        </SingleMetadata>
        <SingleMetadata label="Score">
            {!item.testtuple && 'N/A'}
            {item.testtuple && item.testtuple.status && item.testtuple.status === 'done' && item.testtuple.dataset.perf}
            {item.testtuple && item.testtuple.status && item.testtuple.status !== 'done' && (
                <Fragment>
                    {capitalize(item.testtuple.status)}
                    <InlinePulseLoader loading={['todo', 'doing'].includes(item.testtuple.status)} />
                </Fragment>
            )}
        </SingleMetadata>
        <BrowseRelatedMetadata>
            <BrowseRelatedLinks item={item} />
        </BrowseRelatedMetadata>
    </MetadataWrapper>
);

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
