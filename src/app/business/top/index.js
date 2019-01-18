import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import Link from 'redux-first-router-link';

import DocLink from './components/docLink';
import owkestra from '../../../../assets/img/owkestra.png';
import {white, ice, slate} from '../../../../assets/css/variables/colors';
import {spacingLarge} from '../../../../assets/css/variables/spacing';


const Wrapper = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${white};
    padding: ${spacingLarge};
    height: 80px;
    border-bottom: 1px solid ${ice};
    margin-bottom: ${spacingLarge};
`;


const link = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: ${slate};
    font-weight: normal;
`;

const Top = ({location}) => (
    <Wrapper>
        <Link to={{type: 'HOME', meta: {query: location.query}}} className={link}>
            <img src={owkestra} alt="Owkestra" height={50} />
        </Link>
        <DocLink className={link} />
    </Wrapper>
);

Top.defaultProps = {
    location: {},
};

Top.propTypes = {
    location: PropTypes.shape({}),
};

export default Top;
