import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {metadata, MetadataTag} from '../../../../../common/components/list/components/metadata';

const Metadata = ({o}) => (
    <Fragment>
        {o && o.type === 'composite' && (
            <div className={metadata}>
                <MetadataTag>Composite</MetadataTag>
            </div>
        )}
        {o && o.type === 'aggregate' && (
            <div className={metadata}>
                <MetadataTag>Aggregate</MetadataTag>
            </div>
        )}
    </Fragment>
);

Metadata.propTypes = {
    o: PropTypes.shape({
        type: PropTypes.string,
    }),
};

Metadata.defaultProps = {
    o: null,
};

export default Metadata;
