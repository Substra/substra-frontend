import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {capitalize} from 'lodash';

import {SingleMetadata} from '../../../../../common/components/detail/components/metadata';
import InlinePulseLoader from '../../inlinePulseLoader';

const ScoreMetadata = ({item, label, tupleName}) => (
    <SingleMetadata label={label}>
        {!item[tupleName] && 'N/A'}
        {item[tupleName] && item[tupleName].status && item[tupleName].status === 'done' && `${item[tupleName].dataset.perf.toFixed(2)} ±${item[tupleName].dataset.variance.toFixed(2)}`}
        {item[tupleName] && item[tupleName].status && item[tupleName].status !== 'done' && (
            <Fragment>
                {capitalize(item[tupleName].status)}
                <InlinePulseLoader loading={['todo', 'doing'].includes(item[tupleName].status)} />
            </Fragment>
        )}
    </SingleMetadata>
);

ScoreMetadata.propTypes = {
    item: PropTypes.shape(),
    label: PropTypes.string,
    tupleName: PropTypes.string,
};

ScoreMetadata.defaultProps = {
    item: null,
    label: '',
    tupleName: '',
};

export default ScoreMetadata;
