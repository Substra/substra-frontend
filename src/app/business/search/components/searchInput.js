import React, {Component} from 'react';
import {css} from 'emotion';
import PropTypes from 'prop-types';
import {noop} from 'lodash';

import {withStyles} from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import {spacingExtraSmall, spacingSmall} from '../../../../../assets/css/variables/spacing';
import {fontLarge} from '../../../../../assets/css/variables/font';

// modified textField for our needs
import TextField from './overrides/textField';

const parentChip = isLogic => css`
    padding: ${spacingExtraSmall} ${spacingSmall};
    display: inline-flex;
    font-size: ${fontLarge};
    ${isLogic ? 'color: #1935a7;font-weight: bold' : 'inherit'};
`;

const ChildChip = withStyles({
    root: {
        margin: '2px',
        height: 'auto',
        fontSize: fontLarge,
        padding: `${spacingExtraSmall} ${spacingSmall}`,
    },
    label: {
        padding: 0,
    },
    deleteIcon: {
        fontSize: '20px',
        margin: `0 -${spacingExtraSmall} 0 ${spacingExtraSmall}`,
    },
})(Chip);


const styles = {
    inputWrapper: css`
        margin: 2px 8px;
        font-size: ${fontLarge};
        width: 80px;
        display: inline-block;
        flex-grow: 1;        
    `,
    input: css`
        font-size: ${fontLarge};
        min-width: 450px;
        height: 30px;
    `,
};

class SearchInput extends Component {
    handleClick = () => {
        const {openMenu, clickInput} = this.props;

        openMenu();

        clickInput();
    };

    inputProps = () => {
        const {
            selectedItem, isOpen, inputValue, highlightedIndex,
            getInputProps, handleInputChange, handleKeyDown, handleDelete,
            getItemProps,
        } = this.props;

        return getInputProps({
            startAdornment: selectedItem.map(o => o.child
                ? (
                    <ChildChip
                        key={o.uuid}
                        tabIndex={-1}
                        label={`${o.parent}:${decodeURIComponent(o.child)}`}
                        onDelete={handleDelete(o)}
                    />
                )
                : (
                    <span key={o.uuid} className={parentChip(o.isLogic)}>
                        {`${o.parent}${o.isLogic ? '' : ':'}`}
                    </span>
                )),
            onChange: handleInputChange,
            onKeyDown: handleKeyDown,
            placeholder: selectedItem.length ? '' : 'Add item filters. Ex: "objective: objective1", "dataset: dataset2"',
            classes: styles,
            isOpen,
            getItemProps,
            inputValue,
            highlightedIndex,
            suggestions: this.getSuggestions,
            disableUnderline: true,
        });
    };

    getSuggestions = (inputValue) => {
        const {suggestions} = this.props;

        return suggestions.filter(suggestion => (!inputValue || suggestion.label.toLowerCase().includes(inputValue.replace(/ /g, '').toLowerCase())));
    };

    render() {
        const {input} = this.props;

        return (
            <div onClick={this.handleClick}>
                <TextField
                    fullWidth
                    InputProps={this.inputProps()}
                    inputRef={input}
                />
            </div>
);
    }
}

SearchInput.defaultProps = {
    input: null,
    clickInput: noop,
    openMenu: noop,
    suggestions: [],
    selectedItem: [],
    getInputProps: noop,
    handleInputChange: noop,
    handleKeyDown: noop,
    handleDelete: noop,
    getItemProps: noop,
    isOpen: false,
    inputValue: '',
    highlightedIndex: 0,
};

SearchInput.propTypes = {
    input: PropTypes.shape({}),
    clickInput: PropTypes.func,
    openMenu: PropTypes.func,
    suggestions: PropTypes.arrayOf(PropTypes.shape({})),
    selectedItem: PropTypes.arrayOf(PropTypes.shape({})),
    getInputProps: PropTypes.func,
    handleInputChange: PropTypes.func,
    handleKeyDown: PropTypes.func,
    handleDelete: PropTypes.func,
    getItemProps: PropTypes.func,
    isOpen: PropTypes.bool,
    inputValue: PropTypes.string,
    highlightedIndex: PropTypes.number,
};

export default SearchInput;
