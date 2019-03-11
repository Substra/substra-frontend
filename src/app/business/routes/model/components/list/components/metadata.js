import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {capitalize} from 'lodash';

import {metadata, SingleMetadata} from '../../../../../common/components/list/components/metadata';
import {iceBlue} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';
import InlinePulseLoader from '../../inlinePulseLoader';

const ScoreWrapper = styled('div')`
    background-color: ${iceBlue};
    padding: ${spacingExtraSmall} ${spacingNormal};
    margin: ${spacingExtraSmall} -${spacingNormal} -${spacingSmall} -${spacingNormal};
`;

const Metadata = ({o}) => (
    <div className={metadata}>
        <SingleMetadata label="Status">
            {capitalize(o.traintuple.status)}
            <InlinePulseLoader loading={['todo', 'doing'].includes(o.traintuple.status)} />
        </SingleMetadata>
        {o && o.testtuple && (
            <ScoreWrapper>
                <SingleMetadata label="Score">
                    {o.testtuple.status !== 'done' && (
                        <React.Fragment>
                            {capitalize(o.testtuple.status)}
                            <InlinePulseLoader loading={['todo', 'doing'].includes(o.testtuple.status)} />
                        </React.Fragment>
                    )}
                    {o.testtuple.status === 'done' && o.testtuple.data && o.testtuple.data.perf}
                </SingleMetadata>
            </ScoreWrapper>
        )}
    </div>
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
