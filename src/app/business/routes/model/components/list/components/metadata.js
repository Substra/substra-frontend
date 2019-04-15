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
            {o && o.testtuple && (
                <ScoreWrapper>
                    <SingleMetadata label="Score">
                        {o.testtuple.status !== 'done' && (
                            <Fragment>
                                {capitalize(o.testtuple.status)}
                                <InlinePulseLoader loading={['todo', 'doing'].includes(o.testtuple.status)} />
                            </Fragment>
                        )}
                        {o.testtuple.status === 'done' && o.testtuple.dataset && o.testtuple.dataset.perf}
                        {o.testtuple.status === 'done' && o.testtuple.dataset && 'variance' in o.testtuple.dataset && ` ±${o.testtuple.dataset.variance}`}
                    </SingleMetadata>
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
