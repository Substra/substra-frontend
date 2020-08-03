import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from 'emotion';
import {noop} from 'lodash';

import PropTypes from '../../../../../../utils/propTypes';

import {match, parse} from './utils/autosuggest-highlight';

import {ice} from '../../../../../../../assets/css/variables/colors';
import {fontNormal} from '../../../../../../../assets/css/variables/font';

const Logic = styled('span')`
    color: #1935a7;
    margin: 0 auto;
    font-weight: bold;
`;

const placeholder = `
    color: darkgray;
    opacity: 0.7;
`;

const styles = {
    /* Styles applied to the root element. */
    root: (disabled) => css`
        // Mimics the default input display property used by browsers for an input.
        display: block;
        position: relative;
        cursor: text;
        font-family: 'Lato';
        font-size: ${fontNormal};
        line-height: 1.1875em; // Reset (19px), match the native input line-height
        ${disabled ? `
            color: ${ice};
        ` : ''}
    `,
    /* Styles applied to the root element if `fullWidth={true}`. */
    fullWidth: css`
        width: 100%;
    `,
    /* Styles applied to the `input` Wrapper element. */
    inputWrapper: css`
        width: 200px;
        display: inline-block;
    `,
    /* Styles applied to the `input` element. */
    input: (disabled) => css`
        font: inherit;
        color: currentColor;
        padding: 0;
        border: 0;
        box-sizing: content-box;
        vertical-align: middle;
        background: none;
        margin: 0; // Reset for Safari
        // Remove grey highlight
        -webkit-tap-highlight-color: transparent;
        display: block;
        // Make the flex item shrink with Firefox
        min-width: 0;
        flex-grow: 1;
        &::-webkit-input-placeholder {${placeholder}};
        &::-moz-placeholder {${placeholder}}; // Firefox 19+
        &:-ms-input-placeholder {${placeholder}}; // IE 11
        &::-ms-input-placeholder {${placeholder}}; // Edge
        &:focus {
            outline: 0;
        }
        // Reset Firefox invalid required input style
        &:invalid {
            box-shadow: none;
        }
        &::-webkit-search-decoration {
            // Remove the padding when type=search.
            -webkit-appearance: none;
        },
        
        ${disabled ? 'opacity: 1;' : ''} // Reset iOS opacity
    `,
    /* Styles applied to the `input` element if `margin="dense"`. */
    inputMarginDense: css`
        padding-top: 3px;
    `,
    /* Styles applied to the `input` element if `type` is not "text"`. */
    inputType: css`
        // type="date" or type="time", etc. have specific styles we need to reset.
        height: 1.1875em; // Reset (19px), match the native input line-height
    `,
    /* Styles applied to the `input` element if `type="search"`. */
    inputTypeSearch: css`
        // Improve type search style.
        -moz-appearance: textfield;
        -webkit-appearance: textfield;
    `,
    paper: css`
        color: black;
        background-color: white;
        box-shadow: 0px 1px 2px 0px darkgray;
    `,
    popperOpen: css`
        z-index: 2;
        position: absolute;
    `,
    popperClose: css`
        display: none;
    `,
    highligthed: css`
        font-weight: bold;
    `,
};

const menuItemDefaultCss = `
    line-height: 50px;
    padding-right: 10px;
    padding-left: 10px;
    min-width: 100px;
    cursor: pointer;
    &:hover {
        background-color: #dfdfdf;
    };
`;

class Input extends Component {
    input = null; // Holds the input reference

    handleFocus = (event) => {
        // Fix a bug with IE11 where the focus/blur events are triggered
        // while the input is disabled.

        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    handleBlur = (event) => {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    handleChange = (event) => {
        // Perform in the willUpdate
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    };

    handleRefInput = (ref) => {
        this.inputRef = ref;
        let refProp;

        if (this.props.inputRef) {
            refProp = this.props.inputRef;
        }
        else if (this.props.inputProps && this.props.inputProps.ref) {
            refProp = this.props.inputProps.ref;
        }

        if (refProp) {
            if (typeof refProp === 'function') {
                refProp(ref);
            }
            else {
                refProp.current = ref;
            }
        }
    };

    menuItem = (isLogic) => isLogic ? css`
            ${menuItemDefaultCss};
            text-align: center;
        ` : css`${menuItemDefaultCss}`
    ;

    menuItemHighlighted = (isLogic) => isLogic ? css`
            ${menuItemDefaultCss}
            text-align: center;
            background-color: #dfdfdf;
        ` : css`
            ${menuItemDefaultCss};
            background-color: #dfdfdf;
        `;

    render() {
        const {
            className: classNameProp, // eslint-disable-line no-unused-vars
            classes,
            endAdornment,
            inputComponent,
            inputProps: {className: inputPropsClassName, ...inputPropsProp} = {}, // eslint-disable-line no-unused-vars
            onKeyDown,
            placeholder,
            startAdornment,
            value,
            isOpen,
            getItemProps,
            inputValue,
            highlightedIndex,
            suggestions,
            inputRef, // eslint-disable-line no-unused-vars
            inputWrapperRef, // eslint-disable-line no-unused-vars
            ...other
        } = this.props;

        const className = css`
            ${styles.formControl};           
        `;
        const inputClassName = css`
            ${styles.input()};
            ${classes.input}
        `;

        const inputwrapperClassName = css`
            ${styles.inputWrapper};
            ${classes.inputWrapper}
        `;

        const InputComponent = 'input';
        let inputProps = {
            ...inputPropsProp,
            ref: this.handleRefInput,
        };

        if (inputComponent) {
            inputProps = {
                // Rename ref to inputRef as we don't know the
                // provided `inputComponent` structure.
                inputRef: this.handleRefInput,
                ...inputProps,
                ref: null,
            };
        }

        return (
            <div className={className} {...other}>
                {startAdornment}
                <div className={inputwrapperClassName}>
                    <InputComponent
                        data-testid="searchbar"
                        className={inputClassName}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        value={value}
                        {...inputProps}
                    />
                    <div
                        data-testid="popper"
                        className={isOpen ? styles.popperOpen : styles.popperClose}
                    >
                        <div className={styles.paper}>
                            {suggestions(inputValue).map((suggestion, index) => {
                                const isHighlighted = highlightedIndex === index;
                                const itemProps = getItemProps({item: suggestion});

                                const highlighted = parse(suggestion.label, match(suggestion.label, inputValue, {insideWords: true}));

                                return (
                                    <div
                                        {...itemProps}
                                        key={suggestion.uuid || suggestion.label}
                                        className={isHighlighted ? this.menuItemHighlighted(suggestion.isLogic) : this.menuItem(suggestion.isLogic)}
                                    >
                                        {
                                            suggestion.isLogic
                                            ? (
                                                <Logic>
                                                    {suggestion.label}
                                                </Logic>
                                            )

                                            : highlighted.map((o, i) => o.highlight
                                                ? (
                                                    <span key={i} className={styles.highligthed}>
                                                        {decodeURIComponent(o.text)}
                                                    </span>
                                                )
                                                : decodeURIComponent(o.text))
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {endAdornment}
            </div>
        );
    }
}

Input.propTypes = {
    /**
     * Override or extend the styles applied to the component.
     * See [CSS API](#css-api) below for more details.
     */
    classes: PropTypes.shape({
        input: PropTypes.string,
        inputWrapper: PropTypes.string,
    }).isRequired,
    /**
     * The CSS class name of the wrapper element.
     */
    className: PropTypes.string,
    /**
     * End `
     InputAdornment` for this component.
     */
    endAdornment: PropTypes.node,
    /**
     * The component used for the native input.
     * Either a string to use a DOM element or a component.
     */
    inputComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.shape({})]),
    /**
     * Attributes applied to the `
     input` element.
     */
    inputProps: PropTypes.shape({
        ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
    }),
    /**
     * Use that property to pass a ref callback to the native input component.
     */
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
    /**
     * Use that property to pass a ref callback to wrapper of the native input component.
     */
    inputWrapperRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})]),
    /**
     * If `
     dense`, will adjust vertical spacing. This is normally obtained via context from
     * FormControl.
     */
    margin: PropTypes.oneOf(['dense', 'none']),
    /**
     * @ignore
     */
    onBlur: PropTypes.func,
    /**
     * Callback fired when the value is changed.
     *
     * @param {object} event The event source of the callback.
     * You can pull out the new value by accessing `
     event.target.value`.
     */
    onChange: PropTypes.func,
    /**
     * @ignore
     */
    onFocus: PropTypes.func,
    /**
     * @ignore
     */
    onKeyDown: PropTypes.func,
    /**
     * The short hint displayed in the input before the user enters a value.
     */
    placeholder: PropTypes.string,
    /**
     * Start `
     InputAdornment` for this component.
     */
    startAdornment: PropTypes.node,
    /**
     * The input value, required for a controlled component.
     */
    // eslint-disable-next-line react/require-default-props
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    ]),
    /**
     * Display the dropdown list
     */
    isOpen: PropTypes.bool,
    /**
     * Get item props for the dropdown list menu itens
     */
    getItemProps: PropTypes.func,
    /**
     * The input value given from the user for filtering on suggestions
     */
    inputValue: PropTypes.string,
    /**
     * The index to know which to highlight
     */
    highlightedIndex: PropTypes.number,
    /**
     * Function for getting suggestions
     */
    suggestions: PropTypes.func,
};

Input.defaultProps = {
    className: '',
    endAdornment: '',
    inputComponent: '',
    inputProps: {},
    inputRef: noop,
    inputWrapperRef: noop,
    margin: 'none',
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    onKeyDown: noop,
    placeholder: '',
    startAdornment: '',
    isOpen: false,
    getItemProps: noop,
    inputValue: '',
    highlightedIndex: 0,
    suggestions: noop,
};

export default Input;
