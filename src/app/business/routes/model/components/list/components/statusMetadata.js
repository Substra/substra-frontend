import React from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

import {SingleMetadata} from '../../../../../common/components/list/components/metadata';
import InlinePulseLoader from '../../inlinePulseLoader';

const StatusMetadata = ({status}) => (
    <SingleMetadata label="Status">
        {capitalize(status)}
        <InlinePulseLoader loading={['waiting', 'todo', 'doing'].includes(status)} />
    </SingleMetadata>
);

StatusMetadata.propTypes = {
    status: PropTypes.string,
};

StatusMetadata.defaultProps = {
    status: '',
};

export default StatusMetadata;
