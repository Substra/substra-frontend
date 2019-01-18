import React from 'react';
import PropTypes from 'prop-types';
import {SingleMetadata, metadata} from '../../../../../common/components/list/components/metadata';

const Metadata = ({o}) => (
    <div className={metadata}>
        {o && o.metrics && (
            <SingleMetadata key="metric" label="Metric" value={o.metrics.name} />
        )}
    </div>
);

Metadata.propTypes = {
    o: PropTypes.shape(),
};

Metadata.defaultProps = {
    o: null,
};

export default Metadata;
