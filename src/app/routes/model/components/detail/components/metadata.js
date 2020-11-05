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
    MetadataMetadata,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/copyInput';
import BrowseRelatedLinks from './browseRelatedLinks';
import StatusMetadata from './statusMetadata';


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
                        <KeyMetadata addNotification={this.addNotification} assetName="model" assetKey={item.traintuple.out_model ? item.traintuple.out_model.key : 'N/A'} />
                    </>
                )}
                {type === 'composite' && (
                    <>
                        <KeyMetadata addNotification={this.addNotification} assetName="composite traintuple" assetKey={item.traintuple.key} />
                        <KeyMetadata addNotification={this.addNotification} assetName="head model" assetKey={item.traintuple.out_head_model.out_model ? item.traintuple.out_head_model.out_model.key : 'N/A'} />
                        <KeyMetadata addNotification={this.addNotification} assetName="trunk model" assetKey={item.traintuple.out_trunk_model.out_model ? item.traintuple.out_trunk_model.out_model.key : 'N/A'} />
                    </>
                )}
                {type === 'aggregate' && (
                    <>
                        <KeyMetadata addNotification={this.addNotification} assetName="aggregatetuple" assetKey={item.traintuple.key} />
                        <KeyMetadata addNotification={this.addNotification} assetName="model" assetKey={item.traintuple.out_model ? item.traintuple.out_model.key : 'N/A'} />
                    </>
                )}
                <StatusMetadata status={item.traintuple.status} />
                {item.traintuple.tag && <SingleMetadata label="Tag" value={item.traintuple.tag} />}
                <SingleMetadata label="Creator" value={item.traintuple.creator} />
                <SingleMetadata label="Worker" value={type === 'aggregate' ? item.traintuple.worker : item.traintuple.dataset.worker} />
                <PermissionsMetadata permissions={item.traintuple.permissions} />
                <MetadataMetadata metadata={item.traintuple.metadata} />
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
