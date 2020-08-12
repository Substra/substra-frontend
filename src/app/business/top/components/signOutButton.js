import React from 'react';
import PropTypes from 'prop-types';
import {css} from 'emotion';

import {SignOut} from '../../common/components/icons';
import {slate} from '../../../../../assets/css/variables/colors';

const picto = css`
    display: block;
`;

const button = css`
    cursor: pointer;
    border: none;
    padding: 0;
    background-color: transparent;
`;

export const SignOutButton = ({className, ...props}) => (
    <button
        type="button"
        className={css`${button} ${className}`}
        {...props}
    >
        <SignOut className={picto} color={slate} />
        Sign out
    </button>
);

SignOutButton.propTypes = {
    className: PropTypes.string,
};

SignOutButton.defaultProps = {
    className: null,
};

export default SignOutButton;
