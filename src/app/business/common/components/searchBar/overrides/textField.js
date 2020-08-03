import React from 'react';
import {noop} from 'lodash';
import PropTypes from '../../../utils/propTypes';
import Input from './input';

function TextField(props) {
    const {
        className,
        defaultValue,
        InputProps,
        inputRef,
        onBlur,
        onChange,
        onFocus,
        placeholder,
        value,
        ...other
    } = props;

    const InputElement = (
        <Input
            defaultValue={defaultValue}
            value={value}
            inputRef={inputRef}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            {...InputProps}
        />
    );

    return (
        <div
            className={className}
            {...other}
        >
            {InputElement}
        </div>
    );
}

TextField.propTypes = {
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
     * Properties applied to the `Input` element.
     */
    InputProps: PropTypes.shape({}),
    /**
     * Use that property to pass a ref callback to the native input component.
     */
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
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
     * The value of the `Input` element, required for a controlled component.
     */
    // eslint-disable-next-line react/require-default-props
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    ]),
};

TextField.defaultProps = {
    className: '',
    InputProps: {},
    inputRef: {},
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    placeholder: '',
};

export default TextField;
