import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import {css} from 'emotion';

import {reduxForm, Field} from 'redux-form';
import {slate} from '../../../../../assets/css/variables/colors';


const form = css`
    margin: 10px;
`;

const input = css`
    border: 1px solid ${slate};
    background-color: transparent;
    padding 12px 10px;
    width: 100%;
    margin: 2px;
    font-size: 16px;
`;

const submit = css`
    font-size: 16px;
    margin: 30px auto 0;
    display: block;
    width: 50%;
    border: 1px solid ${slate};
    outline: none;
    color: ${slate};
    background-color: white;
    padding: 10px;
    cursor: pointer;
`;

const SignInForm = ({signInError, signIn, handleSubmit}) => (
    <form onSubmit={handleSubmit(signIn)} className={form}>
        <Field name="username" component="input" type="text" placeholder="username" className={input} autoComplete="username" />
        {signInError && signInError.username && signInError.username.map((error, i) => (
            <span key={error} className="error">{error}</span>))
        }
        <Field name="password" component="input" type="password" placeholder="password" className={input} autoComplete="current-password" />
        {signInError && signInError.password && signInError.password.map((error, i) => (
            <span key={error} className="error">{error}</span>))
        }
        <button
            type="submit"
            className={submit}
            onClick={handleSubmit(signIn)}
        >
            Log in
        </button>
    </form>
);


SignInForm.propTypes = {
    signInError: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.bool,
    ]),
    signIn: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
};

SignInForm.defaultProps = {
    signInError: null,
    signIn: null,
};

export default onlyUpdateForKeys(['signInError'])(reduxForm(
    {
        form: 'signIn',
        validate: (values) => {
            const errors = {};
            const requiredFields = ['username', 'password'];
            requiredFields.forEach((field) => {
                if (values && !values[field]) {
                    errors[field] = 'Required';
                }
            });
            return errors;
        },
    })(SignInForm));
