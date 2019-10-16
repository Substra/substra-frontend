import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import {css} from 'emotion';

import {reduxForm, Field} from 'redux-form';
import {slate} from '../../../../../assets/css/variables/colors';


const form = css`
    margin: 10px;
`;

const wrapper = css`
    position: relative;
`;

const inputCss = css`
    border: 1px solid ${slate};
    background-color: transparent;
    padding: 12px 10px;
    margin: 2px;
    width: 100%;
    font-size: 16px;
`;

const errorCss = css`
    position: absolute;
    top: 4px;
    right: 2px;
    color: red;
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

const RenderField = ({
input, placeholder, type, meta: {touched, error},
}) => (
    <div className={wrapper}>
        <input {...input} placeholder={placeholder} type={type} className={inputCss} />
        {touched && error && <span className={errorCss}>{error}</span>}
    </div>
);

RenderField.propTypes = {
    input: PropTypes.shape({}).isRequired,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    meta: PropTypes.shape({}).isRequired,
};

const SignInForm = ({signIn, handleSubmit}) => (
    <form onSubmit={handleSubmit(signIn)} className={form}>
        <Field name="username" component={RenderField} type="text" placeholder="username" autoComplete="username" />
        <Field name="password" component={RenderField} type="password" placeholder="password" autoComplete="current-password" />
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
    signIn: PropTypes.func,
    handleSubmit: PropTypes.func.isRequired,
};

SignInForm.defaultProps = {
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
