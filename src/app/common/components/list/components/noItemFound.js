import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {spacingNormal, spacingSmall} from '../../../../../../assets/css/variables/spacing';

const Padding = styled('div')`
    padding: ${spacingSmall} ${spacingNormal};
`;

const NoItemFound = ({model}) => (
    <Padding>
        {`No ${model} found`}
    </Padding>
);

NoItemFound.propTypes = {
    model: PropTypes.string.isRequired,
};

export default NoItemFound;
