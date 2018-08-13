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
export challengeReducer from '../../routes/challenge/reducers';
export challengeSagas from '../../routes/challenge/sagas';
export datasetReducer from '../../routes/dataset/reducers';
export datasetSagas from '../../routes/dataset/sagas';
export algoReducer from '../../routes/algorithm/reducers';
export algoSagas from '../../routes/algorithm/sagas';
export modelReducer from '../../routes/model/reducers';
export modelSagas from '../../routes/model/sagas';

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
    state = {
        inputValue: '',
        selectedItem: [],
        isParent: true,
    };

    constructor(props) {
        super(props);

        this.input = React.createRef();
    }

    componentDidMount() {
        // init suggestions
        const {location, setFilters} = this.props;

        let selectedItem = [];
        // fill search from state.location
        if (location.query && location.query.search) {
            // get groups separated by _OR_
            const groups = location.query.search.split('_OR_');
            const logic = {
                parent: '_OR_',
                child: '',
                uuid: uuidv4(),
                isLogic: true,
            };

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

                return [
                    ...p,
                    ...(group ? chips : []),
                    logic, // will add an extra logic el on the last iteration
                ];
            }, []).slice(0, -1); // remove last added `_OR_`
        }

        this.setState(state => ({
            ...state,
            // fill search from state.location
            selectedItem,
        }));

        // init redux store
        setFilters(selectedItem);
    }

    handleKeyDown = (event) => {
        const {setFilters, setItem} = this.props;
        const {inputValue, selectedItem} = this.state;

        if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
            const newSelectedItems = selectedItem.slice(0, selectedItem.length - 1);

            // TODO this triggers too much rendering, try to gather in one
            this.setState({
                selectedItem: newSelectedItems,
                isParent: true,
            });

            setFilters(newSelectedItems);
            setItem('');
        }
    };

    handleInputChange = (event) => {
        this.setState({inputValue: event.target.value});
    };

    handleChange = (item) => {
        const {
            parentSuggestions,
            setItem, setFilters,
        } = this.props;
        const {isParent, selectedItem} = this.state;

        let newSelectedItem;

        if (!isParent) { // remove precedent parent and add child
            const prev = selectedItem.pop();
            newSelectedItem = [...selectedItem, {...prev, child: item.label}];

            setFilters(newSelectedItem);
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

        // calculate if previously in parent menu
        const selectedParent = parentSuggestions.map(o => o.label).includes(item.label);

        // setItem in redux, and launch related sagas for fetching list if needed
        setItem(selectedParent || item.isLogic ? item.label : '');

        this.setState(state => ({
            ...state,
            isParent: item.isLogic || !selectedParent,
            inputValue: '',
            selectedItem: newSelectedItem,
        }));
    };

    handleDelete = item => () => {
        const {setFilters, setItem} = this.props;
        const {selectedItem} = this.state;

        // remove empty parent, the item we want to delete
        let newSelectedItems = selectedItem.filter(o => !((o.child === '' && !o.isLogic) // remove parent without child
                    || o.uuid === item.uuid), // remove item clicked

        );

        // remove _OR_ item if not a chip before (i.e nothing or another _OR_)
        newSelectedItems = newSelectedItems.filter((o, i) => !(o.isLogic && i === 0 // remove first item if isLogic
                    || o.isLogic && i > 0 && newSelectedItems[i - 1].isLogic), // remove isLogic if precedent isLogic

        );

        // TODO this triggers too much rendering, try to gather in one
        setFilters(newSelectedItems);

        // need to setItem correctly after deleting
        const l = newSelectedItems.length,
            last = l ? newSelectedItems[l - 1] : undefined;
        setItem(last && last.isLogic ? '_OR_' : '');

        this.setState(state => ({
            ...state,
            selectedItem: newSelectedItems,
            isParent: true,
        }));

        this.clickInput();
    };

    handleOuterClick = (e) => {
        this.setState(state => ({
            ...state,
            inputValue: '',
        }));
    };

    clear = () => {
        const {setFilters, setItem} = this.props;

        // TODO this triggers too much rendering, try to gather in one
        setFilters([]);
        setItem('');

        this.setState(state => ({
            ...state,
            selectedItem: [],
            isParent: true,
        }));

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
        const {inputValue, selectedItem} = this.state;

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
    setFilters: PropTypes.func.isRequired,
    setItem: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    location: state.location,
    item: state.search.item,
    suggestions: getSuggestions(state),
    parentSuggestions: getParentSuggestions(state),
    isInParentMode: getIsInParentMode(state),
    filters: getSearchFilters(state),
    ...ownProps,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFilters: actions.filters.set,
    setItem: actions.item.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Search);
