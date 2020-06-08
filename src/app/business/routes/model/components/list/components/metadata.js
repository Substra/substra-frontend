import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

import {metadata, SingleMetadata, MetadataTag} from '../../../../../common/components/list/components/metadata';
import StatusMetadata from './statusMetadata';


const Metadata = ({o}) => {
    const hasTags = o && o.traintuple && ['composite', 'aggregate'].includes(o.traintuple.type);

    return (
        <>
            {hasTags && (
                <div className={metadata}>
                    {o && o.traintuple && ['composite', 'aggregate'].includes(o.traintuple.type) && (
                        <MetadataTag>
                            {capitalize(o.traintuple.type)}
                        </MetadataTag>
                    )}
                </div>
            )}
            <div className={metadata}>
                <StatusMetadata status={o.traintuple.status} />
                {o && o.traintuple && o.traintuple.tag && (
                    <SingleMetadata label="Tag" value={o.traintuple.tag} />
                )}
            </div>
        </>
    );
};

Metadata.propTypes = {
    o: PropTypes.shape(),
};

Metadata.defaultProps = {
    o: null,
};

export default Metadata;
