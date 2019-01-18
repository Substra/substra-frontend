import React from 'react';
import {css} from 'emotion';
import {blueGrey, iceBlue} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall} from '../../../../../../../../assets/css/variables/spacing';
import Clipboard from '../../../../../common/svg/clipboard';

import {
    KeyMetadata, MetadataInterface,
    MetadataWrapper,
    SingleMetadata, clipboard,
} from '../../../../../common/components/detail/components/metadata';

const dataKeys = css`
    background-color: ${iceBlue};
    border: none;
    width: 100%;
    color: ${blueGrey};
    line-height: 1.4;
    padding: ${spacingExtraSmall};
    margin-top: ${spacingExtraSmall};
`;

const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <KeyMetadata item={item} addNotification={addNotification} model={model} />
        {item && item.trainDataKeys && (
            <SingleMetadata label="Data keys">
                <span
                    onClick={addNotification(item.trainDataKeys.join(','), 'Datas\'s key successfully copied to clipboard!')}
                    className={css`cursor: default;`}
                >
                    Copy all as a CSV string
                    <Clipboard width={15} className={clipboard} color={blueGrey} />
                </span>
                <textarea
                    readOnly
                    className={dataKeys}
                    rows={Math.min(5, item.trainDataKeys.length)}
                    value={item.trainDataKeys.join('\n')}
                />
            </SingleMetadata>
        )}
    </MetadataWrapper>
);

Metadata.propTypes = MetadataInterface.propTypes;
Metadata.defaultProps = MetadataInterface.defaultProps;

export default Metadata;
