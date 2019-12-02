import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

import {metadata, MetadataTag} from '../../../../../common/components/list/components/metadata';

const Metadata = ({o}) => (
    <Fragment>
        {o && ['composite', 'aggregate'].includes(o.type) && (
            <div className={metadata}>
                <MetadataTag>{capitalize(o.type)}</MetadataTag>
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
