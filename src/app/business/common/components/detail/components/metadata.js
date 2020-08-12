import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {capitalize, noop} from 'lodash';

import {spacingExtraSmall, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
import {blueGrey} from '../../../../../../../assets/css/variables/colors';
import {monospaceFamily} from '../../../../../../../assets/css//variables/font';
import CopyInput from '../../copyInput';

const LABEL_WIDTH = '200';

export const MetadataWrapper = styled('dl')`
    display: flex;
    flex-wrap: wrap;
    color: ${blueGrey};
    margin: 0;
`;

const baseDt = css`
    text-transform: uppercase;
    font-weight: bold;
    width: ${LABEL_WIDTH}px;
    margin-bottom: ${spacingExtraSmall};
    padding: 0;
`;

const baseDd = css`
    position: relative;
    margin-left: 0;
    width: calc(100% - ${LABEL_WIDTH}px);
    margin-bottom: ${spacingExtraSmall};
`;

const metadataDt = css`
    text-transform: initial;
    font-family: ${monospaceFamily};
    padding-left: ${spacingSmall};
    &:before {
        content: '- ';
    }
`;

const metadataDd = css`
    font-family: ${monospaceFamily};`;

export const clipboard = css`
    position: absolute;
    margin-top: -5px;
    margin-left: ${spacingExtraSmall};
    cursor: pointer;
`;


export const SingleMetadata = ({
    label, value, children, labelClassName, valueClassName,
}) => {
    const dt = css`
        ${baseDt}
        ${labelClassName}
    `;

    const dd = css`
        ${baseDd}
        ${valueClassName}
    `;
    return (
        <>
            <dt className={dt}>{label}</dt>
            <dd className={dd}>{value || children}</dd>
        </>
    );
};

SingleMetadata.propTypes = {
    label: PropTypes.string,
    value: PropTypes.node,
    children: PropTypes.node,
    labelClassName: PropTypes.string,
    valueClassName: PropTypes.string,
};

SingleMetadata.defaultProps = {
    label: '',
    value: '',
    children: null,
    labelClassName: null,
    valueClassName: null,
};

export const MetadataInterface = {
    propTypes: {
        item_key: PropTypes.string,
        addNotification: PropTypes.func,
        model: PropTypes.string,
    },
    defaultProps: {
        item_key: '',
        addNotification: noop,
        model: '',
    },
};

export const keyLabelClassName = css`
    line-height: 30px;
`;
export const keyValueClassName = css`
    margin-left: -${spacingSmall};
    width: calc(100% - ${LABEL_WIDTH}px + ${spacingSmall});
`;

export class KeyMetadata extends Component {
    copy = () => {
        const {item_key, addNotification, model} = this.props;
        addNotification(item_key, `${capitalize(model)}'s key successfully copied to clipboard!`);
    };

    render() {
        const {item_key} = this.props;
        return (
            <SingleMetadata
                label="key"
                labelClassName={keyLabelClassName}
                valueClassName={keyValueClassName}
            >
                <CopyInput
                    value={item_key}
                    addNotification={this.copy}
                />
            </SingleMetadata>
        );
    }
}

KeyMetadata.propTypes = MetadataInterface.propTypes;
KeyMetadata.defaultProps = MetadataInterface.defaultProps;

export const BrowseRelatedMetadata = ({children}) => (
    <SingleMetadata label="Browse related">{children}</SingleMetadata>
);

BrowseRelatedMetadata.propTypes = MetadataInterface.propTypes;
BrowseRelatedMetadata.defaultProps = MetadataInterface.defaultProps;

export const PermissionsMetadata = ({permissions}) => {
    const isPublic = permissions && permissions.process && permissions.process.public;
    const authorizedIds = permissions && permissions.process && permissions.process.authorizedIDs;
    let message;

    if (isPublic) {
        message = 'Processable by anyone';
    }
    else if (!authorizedIds) {
        message = 'Processable by its owner only';
    }
    else {
        message = 'Restricted';
    }

    return <SingleMetadata label="Permissions" value={message} />;
};

export const OwnerMetadata = ({owner}) => (
    <SingleMetadata label="Owner" value={owner} />
);

OwnerMetadata.propTypes = {
    owner: PropTypes.string,
};

OwnerMetadata.defaultProps = {
    owner: '',
};

export const MetadataMetadata = ({metadata}) => {
    const keys = Object.keys(metadata).sort();

    return (keys.length ? (
        <>
            <SingleMetadata label="Metadata" />
            {keys.map((key) => (
                <SingleMetadata labelClassName={metadataDt} valueClassName={metadataDd} key={key} label={key} value={metadata[key]} />))}
        </>
        ) : <SingleMetadata label="Metadata" value="N/A" />
    );
};

MetadataMetadata.propTypes = {
    metadata: PropTypes.shape(),
};

MetadataMetadata.defaultProps = {
    metadata: {},
};

PermissionsMetadata.propTypes = {
    permissions: PropTypes.shape({
        request: PropTypes.shape({
            isPublic: PropTypes.bool,
            authorizedIDs: PropTypes.array,
        }),
        process: PropTypes.shape({
            public: PropTypes.bool,
            authorizedIDs: PropTypes.array,
        }),
    }),
};

PermissionsMetadata.defaultProps = {
    permissions: null,
};


const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.key} addNotification={addNotification} model={model} />
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
