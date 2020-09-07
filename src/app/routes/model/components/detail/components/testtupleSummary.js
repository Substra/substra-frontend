import React from 'react';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {noop} from 'lodash';

import PropTypes from 'prop-types';
import {spacingNormal} from '../../../../../../../assets/css/variables/spacing';
import {ice} from '../../../../../../../assets/css/variables/colors';
import {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName,
    MetadataMetadata,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/copyInput';
import ScoreMetadata from './scoreMetadata';
import StatusMetadata from './statusMetadata';
import CodeSample from '../../../../../common/components/codeSample';

const PseudoSection = styled('div')`
    padding-bottom: ${spacingNormal};
    border-bottom: 1px solid ${ice};
    margin-bottom: ${spacingNormal};
`;

const margins = css`
    margin: ${spacingNormal} 0;
`;

const TesttupleSummary = ({testtuple, addNotification}) => (
    <PseudoSection id={testtuple.key}>
        <MetadataWrapper>
            <SingleMetadata
                label="Testtuple key"
                labelClassName={keyLabelClassName}
                valueClassName={keyValueClassName}
            >
                <CopyInput
                    value={testtuple.key}
                    addNotification={addNotification}
                    addNotificationMessage="Testtuple's key successfully copied to clipboard!"
                />
            </SingleMetadata>
            <StatusMetadata status={testtuple.status} />
            <ScoreMetadata
                label="Score"
                tupleName="testtuple"
                item={{testtuple}}
            />
            <MetadataMetadata metadata={testtuple.metadata} />
        </MetadataWrapper>

        <CodeSample
            className={margins}
            filename="testtuple.json"
            language="json"
            collapsible
            codeString={JSON.stringify(testtuple, null, 2)}
        />
    </PseudoSection>
);

TesttupleSummary.propTypes = {
    testtuple: PropTypes.shape(),
    addNotification: PropTypes.func,
};

TesttupleSummary.defaultProps = {
    testtuple: null,
    addNotification: noop,
};

export default TesttupleSummary;
