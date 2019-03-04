import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {capitalize, noop} from 'lodash';

import {spacingExtraSmall} from '../../../../../../../assets/css/variables/spacing';
import Clipboard from '../../../svg/clipboard';
import {blueGrey} from '../../../../../../../assets/css/variables/colors';

const LABEL_WIDTH = '120';

export const MetadataWrapper = styled('dl')`
    display: flex;
    flex-wrap: wrap;
    align-items: top;
    color: ${blueGrey};
    margin: 0;
`;

const dt = css`
    text-transform: uppercase;
    font-weight: bold;
    width: ${LABEL_WIDTH}px;
    margin-bottom: ${spacingExtraSmall};
    padding: 0;
`;

const dd = css`
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


export const SingleMetadata = ({label, value, children}) => (
    <React.Fragment>
        <dt className={dt}>{label}</dt>
        <dd className={dd}>{value || children}</dd>
    </React.Fragment>
);

SingleMetadata.propTypes = {
    label: PropTypes.string,
    value: PropTypes.node,
    children: PropTypes.node,
};

SingleMetadata.defaultProps = {
    label: '',
    value: '',
    children: null,
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

export const KeyMetadata = ({item_key, addNotification, model}) => (
    <SingleMetadata label="key">
        {item_key}
        <Clipboard
            width={15}
            className={clipboard}
            color={blueGrey}
            onClick={addNotification(item_key, `${capitalize(model)}'s key successfully copied to clipboard!`)}
        />
    </SingleMetadata>
);

KeyMetadata.propTypes = MetadataInterface.propTypes;
KeyMetadata.defaultProps = MetadataInterface.defaultProps;


const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item_key={item.key} addNotification={addNotification} model={model} />
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
