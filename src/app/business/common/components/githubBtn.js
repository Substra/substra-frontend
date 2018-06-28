import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'react-emotion';

import Github from '../svg/github';
import {slate} from '../../../../assets/css/variables/index';


const Wrapper = styled('a')`
    display: block;
    color: ${slate};
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    background-color: #ffffff;
    padding: 10px 0 8px;
    width: 220px;
    margin: 0 auto;
    cursor: pointer;
    text-align: center;
    
    &:visited {
        color: ${slate};
    }
`;

const middle = css`
    display: inline-block;
    vertical-align: middle;
`;

const Span = styled('span')`
    ${middle};
    padding-left: 13px;
    font-size: 14px;
    font-family: 'nunitomedium', sans-serif;
    letter-spacing: 1.5px;
`;

const GithubBtn = ({className}) =>
    (<Wrapper className={className} href="https://github.com/SubstraFoundation" target="_blank" rel="noopener noreferrer">
        <Github className={middle} width={24} height={24} />
        <Span>follow us on Github</Span>
    </Wrapper>);

GithubBtn.defaultProps = {
    className: '',
};

GithubBtn.propTypes = {
    className: PropTypes.string,
};

export default GithubBtn;
