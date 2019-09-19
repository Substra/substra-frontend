import React, {Component, Fragment} from 'react';
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


class Metadata extends Component {
    addNotification = (value, message) => () => {
        const {addNotification} = this.props;
        addNotification(value, message);
    };

    render() {
        const {item} = this.props;
        return (
            <MetadataWrapper>
                <SingleMetadata
                    label="Traintuple key"
                    labelClassName={keyLabelClassName}
                    valueClassName={keyValueClassName}
                >
                    <CopyInput
                        value={item.traintuple.key}
                        addNotification={this.addNotification(item.traintuple.key, 'Traintuple\'s key successfully copied to clipboard!')}
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
                            addNotification={this.addNotification(item.traintuple.outModel.hash, 'Model\'s key successfully copied to clipboard!')}
                        />
                    </SingleMetadata>
                )}
                {!item.traintuple.outModel && (
                    <SingleMetadata label="Model key" value="N/A" />
                )}
                <SingleMetadata label="Status">
                    {capitalize(item.traintuple.status)}
                    <InlinePulseLoader loading={['waiting', 'todo', 'doing'].includes(item.traintuple.status)} />
                </SingleMetadata>
                <SingleMetadata label="Score">
                    {!item.testtuple && 'N/A'}
                    {item.testtuple && item.testtuple.status && item.testtuple.status === 'done' && item.testtuple.dataset.perf}
                    {item.testtuple && item.testtuple.status && item.testtuple.status !== 'done' && (
                        <Fragment>
                            {capitalize(item.testtuple.status)}
                            <InlinePulseLoader loading={['waiting', 'todo', 'doing'].includes(item.testtuple.status)} />
                        </Fragment>
                    )}
                </SingleMetadata>
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
