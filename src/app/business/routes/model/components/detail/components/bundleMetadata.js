import React, {Component} from 'react';
import {capitalize} from 'lodash';

import BaseMetadata, {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName, BrowseRelatedMetadata,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import InlinePulseLoader from '../../inlinePulseLoader';
import ScoreMetadata from './scoreMetadata';
import BrowseRelatedLinks from './browseRelatedLinks';


class Metadata extends Component {
    copy = () => {
        const {item: {tag}, addNotification} = this.props;
        addNotification(tag, 'Bundle\'s tag successfully copied to clipboard!');
    };

    render() {
        const {item} = this.props;
        return (
            <MetadataWrapper>
                <SingleMetadata
                    label="Bundle tag"
                    labelClassName={keyLabelClassName}
                    valueClassName={keyValueClassName}
                >
                    <CopyInput
                        value={item.tag}
                        addNotification={this.copy}
                    />
                </SingleMetadata>
                <SingleMetadata label="Status">
                    {capitalize(item.traintuple.status)}
                    <InlinePulseLoader loading={['todo', 'doing'].includes(item.traintuple.status)} />
                </SingleMetadata>
                <ScoreMetadata
                    label="Validation Score"
                    tupleName="nonCertifiedTesttuple"
                    item={item}
                />
                <ScoreMetadata
                    label="Score"
                    tupleName="testtuple"
                    item={item}
                />
                <BrowseRelatedMetadata>
                    <BrowseRelatedLinks item={item} />
                </BrowseRelatedMetadata>
            </MetadataWrapper>
        );
    }
}

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
