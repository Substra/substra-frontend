import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {css} from 'emotion';
import Link from 'redux-first-router-link';
import {noop} from 'lodash';

import {SubstraLogo} from '../common/components/icons';
import {DocLink} from './components/docLink';
import {SignOutButton} from './components/signOutButton';
import {white, ice, slate} from '../../../assets/css/variables/colors';
import {spacingLarge, spacingNormal} from '../../../assets/css/variables/spacing';


const Wrapper = styled('div')`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: ${white};
    padding: ${spacingLarge};
    height: 80px;
    border-bottom: 1px solid ${ice};
    margin-bottom: ${spacingNormal};
`;


const item = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: ${slate};
    font-weight: normal;
`;

const logo = css`
    ${item}
    margin-right: auto;
`;

const button = css`
    ${item}
    margin-left: ${spacingNormal};
`;

const Top = ({location, signOut}) => (
    <Wrapper>
        <Link
            to={{type: 'HOME', meta: {query: location.query}}}
            className={logo}
            data-testid="homelink"
        >
            <SubstraLogo alt="Substra" height={50} width={266} />
        </Link>
        <DocLink className={button} />
        <SignOutButton className={button} onClick={signOut} />
    </Wrapper>
);

Top.defaultProps = {
    location: {},
    signOut: noop,
};

Top.propTypes = {
    location: PropTypes.shape({
        query: PropTypes.shape({}),
    }),
    signOut: PropTypes.func,
};

export default Top;
