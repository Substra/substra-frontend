// @inheritedComponent FormControl

import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';

import Input from './input';

function TextField(props) {
    const {
        autoComplete,
        autoFocus,
        className,
        defaultValue,
        disabled,
        error,
        fullWidth,
        helperText,
        id,
        inputProps,
        InputProps,
        inputRef,
        name,
        onBlur,
        onChange,
        onFocus,
        placeholder,
        required,
        type,
        value,
        ...other
    } = props;

    const helperTextId = helperText && id ? `${id}-helper-text` : undefined;
    const InputElement = (
        <Input
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            disabled={disabled}
            fullWidth={fullWidth}
            name={name}
            type={type}
            value={value}
            id={id}
            inputRef={inputRef}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            inputProps={inputProps}
            {...InputProps}
        />
    );

    return (
        <FormControl
            aria-describedby={helperTextId}
            className={className}
            error={error}
            fullWidth={fullWidth}
            required={required}
            {...other}
        >
            {InputElement}
        </FormControl>
    );
}

TextField.propTypes = {
    /**
     * This property helps users to fill forms faster, especially on mobile devices.
     * The name can be confusing, as it's more like an autofill.
     * You can learn more about it here:
     * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
     */
    autoComplete: PropTypes.string,
    /**
     * If `true`, the input will be focused during the first mount.
     */
    autoFocus: PropTypes.bool,
    /**
     * @ignore
     */
    className: PropTypes.string,
    /**
     * The default value of the `Input` element.
     */
    // eslint-disable-next-line react/require-default-props
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * If `true`, the input will be disabled.
     */
    disabled: PropTypes.bool,
    /**
     * If `true`, the label will be displayed in an error state.
     */
    error: PropTypes.bool,
    /**
     * If `true`, the input will take up the full width of its container.
     */
    fullWidth: PropTypes.bool,
    /**
     * The helper text content.
     */
    helperText: PropTypes.node,
    /**
     * The id of the `input` element.
     * Use that property to make `label` and `helperText` accessible for screen readers.
     */
    id: PropTypes.string,
    /**
     * Properties applied to the `Input` element.
     */
    InputProps: PropTypes.shape({}),
    /**
     * Attributes applied to the native `input` element.
     */
    inputProps: PropTypes.shape({}),
    /**
     * Use that property to pass a ref callback to the native input component.
     */
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
    /**
     * The label content.
     */
    label: PropTypes.node,
    /**
     * If `dense` or `normal`, will adjust vertical spacing of this and contained components.
     */
    margin: PropTypes.oneOf(['none', 'dense', 'normal']),
    /**
     * Name attribute of the `input` element.
     */
    name: PropTypes.string,
    /**
     * @ignore
     */
    onBlur: PropTypes.func,
    /**
     * Callback fired when the value is changed.
     *
     * @param {object} event The event source of the callback.
     * You can pull out the new value by accessing `event.target.value`.
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    onFocus: PropTypes.func,
    /**
     * The short hint displayed in the input before the user enters a value.
     */
    placeholder: PropTypes.string,
    /**
     * If `true`, the label is displayed as required and the input will be required.
     */
    required: PropTypes.bool,
    /**
     * Type attribute of the `Input` element. It should be a valid HTML5 input type.
     */
    type: PropTypes.string,
    /**
     * The value of the `Input` element, required for a controlled component.
     */
    // eslint-disable-next-line react/require-default-props
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    ]),
};

const noop = () => {};

TextField.defaultProps = {
    required: false,
    autoComplete: '',
    autoFocus: false,
    className: '',
    disabled: false,
    error: false,
    fullWidth: false,
    helperText: '',
    id: '',
    InputProps: {},
    inputProps: {},
    inputRef: {},
    label: '',
    margin: 'none',
    name: '',
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    placeholder: '',
    type: 'text',
};

export default TextField;
