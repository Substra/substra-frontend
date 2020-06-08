/* global SCORE_PRECISION */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {capitalize} from 'lodash';

import {metadata, SingleMetadata, MetadataTag} from '../../../../../common/components/list/components/metadata';
import {iceBlue} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';
import InlinePulseLoader from '../../inlinePulseLoader';
import StatusMetadata from '../../detail/components/statusMetadata';

const ScoreWrapper = styled('div')`
    background-color: ${iceBlue};
    padding: ${spacingExtraSmall} ${spacingNormal};
    margin: ${spacingExtraSmall} -${spacingNormal} -${spacingSmall} -${spacingNormal};
`;


const ScoreMetadata = ({label, testtuple}) => (
    <SingleMetadata label={label}>
        {testtuple.status !== 'done' && (
            <>
                {capitalize(testtuple.status)}
                <InlinePulseLoader loading={['waiting', 'todo', 'doing'].includes(testtuple.status)} />
            </>
        )}
        {testtuple.status === 'done' && testtuple.dataset && typeof testtuple.dataset.perf === 'number' && testtuple.dataset.perf.toFixed(SCORE_PRECISION)}
        {testtuple.status === 'done' && testtuple.dataset && typeof testtuple.dataset.standardDeviation === 'number' && ` ±${testtuple.dataset.standardDeviation.toFixed(SCORE_PRECISION)}`}
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

const Metadata = ({o}) => {
    const hasTags = o && (o.tag || o.traintuple && ['composite', 'aggregate'].includes(o.traintuple.type));

    return (
        <>
            {hasTags && (
                <div className={metadata}>
                    {o && o.tag && <MetadataTag>Model bundle</MetadataTag>}
                    {o && o.traintuple && ['composite', 'aggregate'].includes(o.traintuple.type) && (
                        <MetadataTag>
                            {capitalize(o.traintuple.type)}
                        </MetadataTag>
                    )}
                </div>
            )}
            <div className={metadata}>
                <StatusMetadata status={o.traintuple.status} />
                {o && o.tag && o.nonCertifiedTesttuple && (
                    <ScoreMetadata
                        label="Validation score"
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
        </>
    );
};

Metadata.propTypes = {
    o: PropTypes.shape({
        testData: PropTypes.shape(),
        tag: PropTypes.string,
        traintuple: PropTypes.shape({
            type: PropTypes.string,
            status: PropTypes.string,
        }),
        nonCertifiedTesttuple: PropTypes.shape({}),
        testtuple: PropTypes.shape({}),
    }),
};

Metadata.defaultProps = {
    o: null,
};

export default Metadata;
