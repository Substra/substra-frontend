import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {capitalize, noop} from 'lodash';

import {spacingExtraSmall, spacingSmall} from '../../../../../../../assets/css/variables/spacing';
import {blueGrey} from '../../../../../../../assets/css/variables/colors';
import CopyInput from './copyInput';

const LABEL_WIDTH = '130';

export const MetadataWrapper = styled('dl')`
    display: flex;
    flex-wrap: wrap;
    align-items: top;
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
        <Fragment>
            <dt className={dt}>{label}</dt>
            <dd className={dd}>{value || children}</dd>
        </Fragment>
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

export const KeyMetadata = ({item_key, addNotification, model}) => (
    <SingleMetadata
        label="key"
        labelClassName={keyLabelClassName}
        valueClassName={keyValueClassName}
    >
        <CopyInput
            value={item_key}
            addNotification={addNotification(item_key, `${capitalize(model)}'s key successfully copied to clipboard!`)}
        />
    </SingleMetadata>
);

KeyMetadata.propTypes = MetadataInterface.propTypes;
KeyMetadata.defaultProps = MetadataInterface.defaultProps;

export const BrowseRelatedMetadata = ({children}) => (
    <SingleMetadata label="Browse related">{children}</SingleMetadata>
);

BrowseRelatedMetadata.propTypes = MetadataInterface.propTypes;
BrowseRelatedMetadata.defaultProps = MetadataInterface.defaultProps;


const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.key} addNotification={addNotification} model={model} />
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
