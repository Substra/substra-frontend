import React, {Component} from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';


import {withStyles} from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';

// modified textField for our needs
import TextField from './overrides/textField';

const ParentChip = styled('span')`
    margin: 0 3px;
`;

const ChildChip = styled(Chip)`
    margin: 2px;
`;


const styles = {
    inputWrapper: {
        width: 80,
        display: 'inline-block',
        flexGrow: 0,
    },
    input: {
        minWidth: 450,
        height: 28,
    },
};

class SearchInput extends Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
    }

    handleClick = () => {
        const {openMenu} = this.props;
        openMenu();

        // focus input
        this.input.current.focus();
    };

    inputProps = () => {
        const {
            selectedItem, classes, isOpen, inputValue, highlightedIndex,
            getInputProps, handleInputChange, handleKeyDown, handleDelete,
            getItemProps,
        } = this.props;

        return getInputProps({
            startAdornment: selectedItem.map(o => o.child
                ? (<ChildChip
                    key={o.uuid}
                    tabIndex={-1}
                    label={`${o.parent}:${o.child}`}
                    onDelete={handleDelete(o)}
                />
                )
                : (
                    <ParentChip key={o.uuid}>
                        {`${o.parent}:`}
                    </ParentChip>
                )),
            onChange: handleInputChange,
            onKeyDown: handleKeyDown,
            placeholder: selectedItem.length ? '' : 'Add item filters. Ex: "challenge: challenge1", "dataset: dataset2"',
            classes: {
                input: classes.input,
                inputWrapper: classes.inputWrapper,
            },
            isOpen,
            getItemProps,
            inputValue,
            highlightedIndex,
            suggestions: this.getSuggestions,
        });
    };

    getSuggestions = (inputValue) => {
        const {suggestions} = this.props;

        return suggestions.filter(suggestion => (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())));
    };

    render() {
        return (
            <div onClick={this.handleClick}>
                <TextField
                    fullWidth
                    InputProps={this.inputProps()}
                    inputRef={this.input}
                />
            </div>);
    }
}

const noop = () => {
};

SearchInput.defaultProps = {
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
    classes: {},
};

SearchInput.propTypes = {
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
    classes: PropTypes.shape({}),
};

export default withStyles(styles)(SearchInput);
