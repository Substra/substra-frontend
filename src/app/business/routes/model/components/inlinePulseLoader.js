import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {PulseLoader} from 'react-spinners';
import {blueGrey} from '../../../../../../assets/css/variables/colors';
import {spacingExtraSmall} from '../../../../../../assets/css/variables/spacing';

const Wrapper = styled('div')`
    display: inline-block;
    position: relative;
    bottom: -1px;
    left: ${spacingExtraSmall};
`;

const InlinePulseLoader = ({loading}) => (
    <Wrapper>
        <PulseLoader
            size={3}
            loading={loading}
            color={blueGrey}
        />
    </Wrapper>
);

InlinePulseLoader.propTypes = {
    loading: PropTypes.bool,
};

InlinePulseLoader.defaultProps = {
    loading: true,
};

export default InlinePulseLoader;
