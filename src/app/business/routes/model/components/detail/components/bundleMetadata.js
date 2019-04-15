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
            label="Bundle tag"
            labelClassName={keyLabelClassName}
            valueClassName={keyValueClassName}
        >
            <CopyInput
                value={item.tag}
                addNotification={addNotification(item.tag, 'Bundle\'s tag successfully copied to clipboard!')}
            />
        </SingleMetadata>
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
