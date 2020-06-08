import React from 'react';
import {css} from 'emotion';
import styled from '@emotion/styled';
import {noop} from 'lodash';
import {CodeSample} from '@substrafoundation/substra-ui';

import PropTypes from 'prop-types';
import {spacingNormal} from '../../../../../../../../assets/css/variables/spacing';
import {ice} from '../../../../../../../../assets/css/variables/colors';
import {
    SingleMetadata,
    MetadataWrapper,
    keyLabelClassName,
    keyValueClassName,
} from '../../../../../common/components/detail/components/metadata';
import CopyInput from '../../../../../common/components/detail/components/copyInput';
import ScoreMetadata from './scoreMetadata';
import StatusMetadata from './statusMetadata';

const PseudoSection = styled('div')`
    &:not(:first-child) {
        padding-top: ${spacingNormal};
        border-top: 1px solid ${ice};
        margin-top: ${spacingNormal};
    }
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
