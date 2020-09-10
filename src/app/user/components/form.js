import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import {css} from 'emotion';

import {reduxForm, Field} from 'redux-form';
import {RoundedButton} from '../../common/components/roundedButton';

import {
ice, red, slate, tealish, white,
} from '../../../../assets/css/variables/colors';
import {spacingExtraSmall, spacingNormal} from '../../../../assets/css/variables/spacing';


const form = css`
    display: flex;
    flex-direction: column;
`;

const wrapper = css`
    position: relative;
    margin-bottom: ${spacingNormal};
`;

const inputCss = css`
    width: 100%;
    background-color: transparent;
    color: inherit;
    text-overflow: ellipsis;
    border: 1px solid ${ice};
    height: 30px;
    border-radius: 15px;
    line-height: 28px;
    padding: 0 8px;
`;

const labelCss = css`
    margin-bottom: ${spacingExtraSmall};
    font-weight: bold;
    display: inline-block;
    margin-left: 9px;
`;

const errorCss = css`
    position: absolute;
    top: 0;
    right: 9px;
    color: ${red};
`;

const submit = css`
    background-color: ${tealish};
    color: ${white};
    font-weight: bold;
    border-color: ${tealish};

    &:not(:disabled):hover {
        background-color: ${slate};
        border-color: ${slate};
    }
`;

const RenderField = ({
label, input, placeholder, type, autoComplete, meta: {touched, error},
}) => (
    <div className={wrapper}>
        <label
            className={labelCss}
            htmlFor={input.name}
        >
            {label}
        </label>
        <input
            {...input}
            id={input.name}
            placeholder={placeholder}
            type={type}
            className={inputCss}
            autoComplete={autoComplete}
        />
        {touched && error && <span className={errorCss}>{error}</span>}
    </div>
);

RenderField.propTypes = {
    label: PropTypes.string.isRequired,
    input: PropTypes.shape({
        name: PropTypes.string,
    }).isRequired,
    placeholder: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    autoComplete: PropTypes.string.isRequired,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }).isRequired,
};

const SignInForm = ({signIn, handleSubmit}) => (
    <form onSubmit={handleSubmit(signIn)} className={form}>
        <Field
            name="username"
            component={RenderField}
            type="text"
            placeholder="username"
            label="Username"
            autoComplete="username"
        />
        <Field
            name="password"
            component={RenderField}
            type="password"
            placeholder="password"
            label="Password"
            autoComplete="current-password"
        />
        <RoundedButton
            type="submit"
            className={submit}
            onClick={handleSubmit(signIn)}
        >
            Sign in
        </RoundedButton>
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
