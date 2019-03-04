import React from 'react';
import BaseMetadata, {
    SingleMetadata,
    MetadataWrapper,
    clipboard,
} from '../../../../../common/components/detail/components/metadata';
import {blueGrey} from '../../../../../../../../assets/css/variables/colors';
import Clipboard from '../../../../../common/svg/clipboard';


const Metadata = ({item, addNotification, model}) => (
    <MetadataWrapper>
        <SingleMetadata label="Traintuple key">
            {item.traintuple.key}
            <Clipboard
                width={15}
                className={clipboard}
                color={blueGrey}
                onClick={addNotification(item.traintuple.key, 'Traintuple\'s key successfully copied to clipboard!')}
            />
        </SingleMetadata>
        <SingleMetadata label="Model key">
            {item.traintuple.outModel && (
                <React.Fragment>
                    {item.traintuple.outModel.hash}
                    <Clipboard
                        width={15}
                        className={clipboard}
                        color={blueGrey}
                        onClick={addNotification(item.traintuple.outModel.hash, 'Model\'s key successfully copied to clipboard!')}
                    />
                </React.Fragment>
            )}
            {!item.traintuple.outModel && 'N/A'}
        </SingleMetadata>
        <SingleMetadata label="Status" value={item.traintuple.status} />
        {item.testtuple && item.testtuple.status === 'done' && <SingleMetadata label="Score" value={`${item.testtuple.data.perf}`} />}
    </MetadataWrapper>
);

Metadata.propTypes = BaseMetadata.propTypes;
Metadata.defaultProps = BaseMetadata.defaultProps;

export default Metadata;
