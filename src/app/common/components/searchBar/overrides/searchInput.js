import React, {Component} from 'react';
import {css} from 'emotion';
import {noop} from 'lodash';

import {
    ChipActions,
    ChipButton,
    ChipTitle,
    ChipWrapper,
} from '../../chip';
import PropTypes from '../../../../utils/propTypes';
import {spacingExtraSmall, spacingSmall} from '../../../../../../assets/css/variables/spacing';
import {fontLarge} from '../../../../../../assets/css/variables/font';

// modified textField for our needs
import TextField from './textField';
import ClearIcon from '../../icons/clear';

const parentChip = (isLogic) => css`
    padding: ${spacingExtraSmall} ${spacingSmall};
    display: inline-flex;
    font-size: ${fontLarge};
    ${isLogic ? 'color: #1935a7;font-weight: bold' : 'inherit'};
`;

const styles = (placeholder) => ({
    inputWrapper: css`
        margin: 2px 8px;
        font-size: ${fontLarge};
        width: 80px;
        flex-grow: 1;
    `,
    input: css`
        ${placeholder ? '' : 'width: 400px;'} // needed to display the entire placeholder
        font-size: ${fontLarge};
        height: 30px;
    `,
});

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
            getItemProps, placeholder,
        } = this.props;

        return getInputProps({
            startAdornment: selectedItem.map((o) => o.child
                ? (
                    <ChipWrapper key={o.uuid} data-testid={`chip-${o.uuid}`}>
                        <ChipTitle>{`${o.parent}:${decodeURIComponent(o.child)}`}</ChipTitle>
                        <ChipActions onClick={handleDelete(o)}>
                            <ChipButton Icon={ClearIcon} iconSize={14} iconColor="#E0E0E0" />
                        </ChipActions>
                    </ChipWrapper>
                )
                : (
                    <span key={o.uuid} className={parentChip(o.isLogic)}>
                        {`${o.parent}${o.isLogic ? '' : ':'}`}
                    </span>
                )),
            onChange: handleInputChange,
            onKeyDown: handleKeyDown,
            placeholder: selectedItem.length ? '' : placeholder,
            classes: styles(selectedItem.length),
            isOpen,
            getItemProps,
            inputValue,
            highlightedIndex,
            suggestions: this.getSuggestions,
        });
    };

    getSuggestions = (inputValue) => {
        const {suggestions} = this.props;

        return suggestions.filter((suggestion) => (!inputValue || suggestion.label.toLowerCase().includes(inputValue.replace(/ /g, '').toLowerCase())));
    };

    render() {
        const {input} = this.props;

        return (
            <div onClick={this.handleClick}>
                <TextField
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
    placeholder: '',
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
    placeholder: PropTypes.string,
};

export default SearchInput;
