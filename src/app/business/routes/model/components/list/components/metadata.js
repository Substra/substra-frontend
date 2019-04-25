/* global SCORE_PRECISION */
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {capitalize} from 'lodash';

import {metadata, SingleMetadata} from '../../../../../common/components/list/components/metadata';
import {iceBlue, slate} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';
import InlinePulseLoader from '../../inlinePulseLoader';
import {fontNormal} from '../../../../../../../../assets/css/variables/font';

const ScoreWrapper = styled('div')`
    background-color: ${iceBlue};
    padding: ${spacingExtraSmall} ${spacingNormal};
    margin: ${spacingExtraSmall} -${spacingNormal} -${spacingSmall} -${spacingNormal};
`;

const Tag = styled('div')`
    display: inline-block;
    font-size: ${fontNormal};
    border-radius: ${spacingSmall};
    padding: 0 ${spacingExtraSmall};
    border: 1px solid ${slate};
`;

const ScoreMetadata = ({label, testtuple}) => (
    <SingleMetadata label={label}>
        {testtuple.status !== 'done' && (
            <Fragment>
                {capitalize(testtuple.status)}
                <InlinePulseLoader loading={['todo', 'doing'].includes(testtuple.status)} />
            </Fragment>
        )}
        {testtuple.status === 'done' && testtuple.dataset && typeof testtuple.dataset.perf === 'number' && testtuple.dataset.perf.toFixed(SCORE_PRECISION)}
        {testtuple.status === 'done' && testtuple.dataset && typeof testtuple.dataset.variance === 'number' && ` ±${testtuple.dataset.variance.toFixed(SCORE_PRECISION)}`}
    </SingleMetadata>
);

ScoreMetadata.propTypes = {
    label: PropTypes.string,
    testtuple: PropTypes.shape(),
};

ScoreMetadata.defaultProps = {
    label: '',
    testtuple: null,
};

const Metadata = ({o}) => (
    <Fragment>
        {o && o.tag && (
            <div className={metadata}>
                <Tag>Model bundle</Tag>
            </div>
        )}
        <div className={metadata}>
            <SingleMetadata label="Status">
                {capitalize(o.traintuple.status)}
                <InlinePulseLoader loading={['todo', 'doing'].includes(o.traintuple.status)} />
            </SingleMetadata>
            {o && o.tag && o.nonCertifiedTesttuple && (
                <ScoreMetadata
                    label="Non-certified score"
                    testtuple={o.nonCertifiedTesttuple}
                />
            )}
            {o && o.testtuple && (
                <ScoreWrapper>
                    <ScoreMetadata
                        label="Score"
                        testtuple={o.testtuple}
                    />
                </ScoreWrapper>
            )}
        </div>
    </Fragment>
);

Metadata.propTypes = {
    o: PropTypes.shape({
        testData: PropTypes.shape(),
    }),
};

Metadata.defaultProps = {
    o: null,
};

export default Metadata;
