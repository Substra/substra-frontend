import React, {Component} from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import uuidv4 from 'uuid/v4';
import {bindActionCreators} from 'redux';
import decodeUriComponent from 'decode-uri-component';

import {connect} from 'react-redux';

import styled, {css} from 'react-emotion';

import ClearIcon from '@material-ui/icons/Clear';

import SearchInput from './searchInput';

import {
    getSearchFilters, getSuggestions, getParentSuggestions, getIsInParentMode,
} from '../selector';

import actions from '../actions';

// export needed reducers and sagas
export challengeReducer from '../../routes/challenge/reducers/index';
export challengeSagas from '../../routes/challenge/sagas/index';
export datasetReducer from '../../routes/dataset/reducers/index';
export datasetSagas from '../../routes/dataset/sagas/index';
export algoReducer from '../../routes/algorithm/reducers/index';
export algoSagas from '../../routes/algorithm/sagas/index';
export modelReducer from '../../routes/model/reducers/index';
export modelSagas from '../../routes/model/sagas/index';

const Wrapper = styled('div')`
    margin: 15px auto;
    width: 90%;
`;

const middle = css`
    display: inline-block;
    vertical-align: middle;
`;

const searchInput = css`
    ${middle};
    width: 95%;    
`;

const clear = css`
    ${middle};
    cursor: pointer;
    z-index: 1;
    position: relative;
    // fix bad material-ui ssr with streaming
    width: 1em;
    height: 1em;
    font-size: 24px;
    fill: currentColor;
`;

// use getRootProps https://github.com/paypal/downshift#getrootprops
const SearchInputWrapper = ({innerRef, ...rest}) => (
    <div
        className={searchInput}
        ref={innerRef}
        {...rest}
    />
);

SearchInputWrapper.propTypes = {
    innerRef: PropTypes.func.isRequired,
};

class Search extends Component {
    constructor(props) {
        super(props);

        this.input = React.createRef();
    }

    componentDidMount() {
        // init suggestions
        const {location, setState} = this.props;

        let selectedItem = [];
        // fill search from state.location
        if (location.query && location.query.search) {
            // get groups separated by -OR-
            const groups = location.query.search.split('-OR-');


            selectedItem = groups.reduce((p, group) => {
                // create related chips
                const chips = group.split(',').map((o) => {
                    const el = decodeUriComponent(o).split(':');

                    return {
                        parent: el[0],
                        child: el.splice(1).join(':'),
                        uuid: uuidv4(),
                        isLogic: false,
                    };
                });

                // do not hoist it, uuid need to be different
                const logic = {
                    parent: '-OR-',
                    child: '',
                    uuid: uuidv4(),
                    isLogic: true,
                };

                return [
                    ...p,
                    ...(group ? chips : []),
                    logic, // will add an extra logic el on the last iteration
                ];
            }, []).slice(0, -1); // remove last added `-OR-`
        }

        setState({
            selectedItem,
            toUpdate: false,
        });
    }

    handleKeyDown = (event) => {
        const {setState, inputValue, selectedItem} = this.props;

        if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
            const l = selectedItem.length;

            if (l) {
                const newSelectedItems = selectedItem.slice(0, l - 1);
                const last = selectedItem[l - 1];

                setState({
                    selectedItem: newSelectedItems,
                    isParent: true,
                    item: '',
                    toUpdate: !(last.isLogic || !last.child),
                });
            }
        }
    };

    handleInputChange = (event) => {
        const {setState} = this.props;

        setState({
            inputValue: event.target.value,
            toUpdate: false,
        });
    };

    handleChange = (item) => {
        const {
            parentSuggestions, isParent, selectedItem,
            setState,
        } = this.props;

        let newSelectedItem,
            toUpdate = false;

        if (!isParent) { // remove precedent parent and add child
            const prev = selectedItem.pop();
            newSelectedItem = [...selectedItem, {...prev, child: item.label}];
            toUpdate = true;
        }
        // if is parent, simply add
        else {
            newSelectedItem = [
                ...selectedItem, {
                    parent: item.label,
                    child: '',
                    uuid: uuidv4(),
                    isLogic: item.isLogic,
                }];
        }

        // calculate if previous in parent menu
        const selectedParent = parentSuggestions.map(o => o.label).includes(item.label);

        // set item in redux, and launch related sagas for fetching list if needed
        setState({
            isParent: item.isLogic || !selectedParent,
            inputValue: '',
            selectedItem: newSelectedItem,
            item: selectedParent || item.isLogic ? item.label : '',
            toUpdate,
        });
    };

    handleDelete = item => () => {
        const {setState, selectedItem} = this.props;

        // remove empty parent, the item we want to delete
        let newSelectedItems = selectedItem.filter(o => !(
                (o.child === '' && !o.isLogic) // remove parent without child
                || o.uuid === item.uuid), // remove item clicked

        );

        // remove -OR- item if not a chip before (i.e nothing or another -OR-)
        newSelectedItems = newSelectedItems.filter((o, i) => !(
                o.isLogic && i === 0 // remove first item if isLogic
                || o.isLogic && i > 0 && newSelectedItems[i - 1].isLogic), // remove isLogic if precedent isLogic

        );

        // need to setItem correctly after deleting
        const l = newSelectedItems.length,
            last = l ? newSelectedItems[l - 1] : undefined;

        setState({
            selectedItem: newSelectedItems,
            isParent: true,
            item: last && last.isLogic ? '-OR-' : '',
            toUpdate: true,
        });

        this.clickInput();
    };

    handleOuterClick = () => {
        const {setState, inputValue} = this.props;

        if (inputValue) {
            setState({
                inputValue: '',
            });
        }
    };

    clear = () => {
        const {setState} = this.props;

        setState({
            selectedItem: [],
            isParent: true,
            item: '',
            toUpdate: true,
        });

        this.clickInput();
    };

    clickInput = () => {
        setTimeout(() => {
            // should appear after blur of input (need to call setTimeout as downshift does)
            // stay on focus
            this.input.current.focus();
        }, 0);
    };

    searchInput = (props) => {
        const {suggestions} = this.props;

        // due to ugly render props philosophy of Downshift, we have to extract the declaration in a function...
        return (
            <SearchInputWrapper {...props.getRootProps({refKey: 'innerRef'})}>
                <SearchInput
                    handleKeyDown={this.handleKeyDown}
                    handleInputChange={this.handleInputChange}
                    handleDelete={this.handleDelete}
                    suggestions={suggestions}
                    clickInput={this.clickInput}
                    input={this.input}
                    {...props}
                />
            </SearchInputWrapper>
        );
    };

    itemToString = item => item === null ? '' : item.label;

    render() {
        const {inputValue, selectedItem} = this.props;

        return (
            <Wrapper>
                <Downshift
                    inputValue={inputValue}
                    onChange={this.handleChange}
                    onOuterClick={this.handleOuterClick}
                    selectedItem={selectedItem}
                    itemToString={this.itemToString}
                >
                    {this.searchInput}
                </Downshift>

                <ClearIcon className={clear} onClick={this.clear} />
            </Wrapper>
        );
    }
}

Search.propTypes = {
    location: PropTypes.shape({}).isRequired,
    suggestions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    parentSuggestions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    setState: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
    selectedItem: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isParent: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    inputValue: state.search.inputValue,
    selectedItem: state.search.selectedItem,
    isParent: state.search.isParent,
    location: state.location,
    item: state.search.item,
    suggestions: getSuggestions(state),
    parentSuggestions: getParentSuggestions(state),
    isInParentMode: getIsInParentMode(state),
    filters: getSearchFilters(state),
    ...ownProps,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setState: actions.state.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Search);
