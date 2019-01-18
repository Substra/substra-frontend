import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {metadata, SingleMetadata} from '../../../../../common/components/list/components/metadata';
import {iceBlue} from '../../../../../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal, spacingSmall} from '../../../../../../../../assets/css/variables/spacing';

const ScoreWrapper = styled('div')`
    background-color: ${iceBlue};
    padding: ${spacingExtraSmall} ${spacingNormal};
    margin: ${spacingExtraSmall} -${spacingNormal} -${spacingSmall} -${spacingNormal};
`;

const Metadata = ({o}) => (
    <div className={metadata}>
        <SingleMetadata label="Status" value={o.status} />
        {o && o.testData && (
            <ScoreWrapper>
                <SingleMetadata label="Score" value={o.testData.perf} />
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
