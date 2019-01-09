import React, {Component} from 'react';
import styled from '@emotion/styled';
import {css} from 'emotion';
import PropTypes from 'prop-types';

import Chip from '@material-ui/core/Chip';

// modified textField for our needs
import TextField from './overrides/textField';

const parentChip = isLogic => css`
    margin: 0 3px;
    ${isLogic ? 'color: #1935a7;font-weight: bold' : 'inherit'};
`;

const ChildChip = styled(Chip)`
    margin: 2px;
`;


const styles = {
    inputWrapper: css`
        width: 80px;
        display: inline-block;
        flex-grow: 0;        
        //overflow: hidden;
    `,
    input: css`
        min-width: 450px;
        height: 28px;
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
                        label={`${o.parent}:${o.child}`}
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
            placeholder: selectedItem.length ? '' : 'Add item filters. Ex: "challenge: challenge1", "dataset: dataset2"',
            classes: styles,
            isOpen,
            getItemProps,
            inputValue,
            highlightedIndex,
            suggestions: this.getSuggestions,
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

const noop = () => {
};

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
