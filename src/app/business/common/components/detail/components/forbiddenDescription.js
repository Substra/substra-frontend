import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {RoundedButton} from '@substrafoundation/substra-ui';
import {spacingNormal} from '../../../../../../../assets/css/variables/spacing';

const Span = styled('span')`
    margin-right: ${spacingNormal};
`;

const ForbiddenDescription = ({model, setTabIndex, permissionsTabIndex}) => (
    <>
        <Span>
            {`You do not have enough permissions to see this ${model}'s description.`}
        </Span>
        <RoundedButton onClick={() => setTabIndex(permissionsTabIndex)}>
            Learn more
        </RoundedButton>
    </>
);

ForbiddenDescription.propTypes = {
    model: PropTypes.string.isRequired,
    setTabIndex: PropTypes.func.isRequired,
    permissionsTabIndex: PropTypes.number.isRequired,
};

export default ForbiddenDescription;
