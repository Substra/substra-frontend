import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

import BaseMetadata, {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName,
    BrowseRelatedMetadata,
    PermissionsMetadata,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import BrowseRelatedLinks from './browseRelatedLinks';
import InlinePulseLoader from '../../inlinePulseLoader';


const KeyMetadata = ({addNotification, assetName, assetKey}) => (
    <SingleMetadata
        label={`${capitalize(assetName)} key`}
        labelClassName={keyLabelClassName}
        valueClassName={keyValueClassName}
    >
        <CopyInput
            value={assetKey}
            addNotification={addNotification(assetKey, `${capitalize(assetName)}'s key successfully copied to clipboard!`)}
        />
    </SingleMetadata>
);

KeyMetadata.propTypes = {
    addNotification: PropTypes.func.isRequired,
    assetName: PropTypes.string.isRequired,
    assetKey: PropTypes.string.isRequired,
};

class Metadata extends Component {
    addNotification = (value, message) => () => {
        const {addNotification} = this.props;
        addNotification(value, message);
    };

    render() {
        const {item} = this.props;
        const {traintuple: {type}} = item;
        return (
            <MetadataWrapper>
                {type === 'standard' && (
                    <>
                        <KeyMetadata addNotification={this.addNotification} assetName="traintuple" assetKey={item.traintuple.key} />
                        <KeyMetadata addNotification={this.addNotification} assetName="model" assetKey={item.traintuple.outModel ? item.traintuple.outModel.hash : 'N/A'} />
                    </>
                )}
                {type === 'composite' && (
                    <>
                        <KeyMetadata addNotification={this.addNotification} assetName="composite traintuple" assetKey={item.traintuple.key} />
                        <KeyMetadata addNotification={this.addNotification} assetName="head model" assetKey={item.traintuple.outHeadModel ? item.traintuple.outHeadModel.outModel.hash : 'N/A'} />
                        <KeyMetadata addNotification={this.addNotification} assetName="trunk model" assetKey={item.traintuple.outTrunkModel ? item.traintuple.outTrunkModel.outModel.hash : 'N/A'} />
                    </>
                )}
                {type === 'aggregate' && (
                    <>
                        <KeyMetadata addNotification={this.addNotification} assetName="aggregatetuple" assetKey={item.traintuple.key} />
                        <KeyMetadata addNotification={this.addNotification} assetName="model" assetKey={item.traintuple.outModel ? item.traintuple.outModel.hash : 'N/A'} />
                    </>
                )}
                <SingleMetadata label="Status">
                    {capitalize(item.traintuple.status)}
                    <InlinePulseLoader loading={['waiting', 'todo', 'doing'].includes(item.traintuple.status)} />
                </SingleMetadata>
                <SingleMetadata label="Score">
                    {!item.testtuple && 'N/A'}
                    {item.testtuple && item.testtuple.status && item.testtuple.status === 'done' && item.testtuple.dataset.perf}
                    {item.testtuple && item.testtuple.status && item.testtuple.status !== 'done' && (
                        <>
                            {capitalize(item.testtuple.status)}
                            <InlinePulseLoader loading={['waiting', 'todo', 'doing'].includes(item.testtuple.status)} />
                        </>
                    )}
                </SingleMetadata>
                <SingleMetadata label="Creator" value={item.traintuple.creator} />
                <SingleMetadata label="Worker" value={type === 'aggregate' ? item.traintuple.worker : item.traintuple.dataset.worker} />
                <PermissionsMetadata permissions={item.traintuple.permissions} />
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
