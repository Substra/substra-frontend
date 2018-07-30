import React, {Component} from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import uuidv4 from 'uuid/v4';
import {bindActionCreators} from 'redux';
import {isArray} from 'lodash';

import {connect} from 'react-redux';

import styled, {css} from 'react-emotion';

import ClearIcon from '@material-ui/icons/Clear';

import SearchInput from './searchInput';

import {
    getFilters, getSuggestions, getParentSuggestions, getIsInParentMode,
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

    componentDidMount() {
        // init suggestions
        const {location} = this.props;

        this.setState(state => ({
            ...state,
            // fill search from state.location
            selectedItem: location.query ? Object.keys(location.query).reduce((p, c) => ([
                ...p,
                ...(isArray(location.query[c]) ? location.query[c].map(o => ({
                    parent: c,
                    child: o,
                    uuid: uuidv4(),
                })) : [{
                    parent: c,
                    child: location.query[c],
                    uuid: uuidv4(),
                }]),
            ]), []) : [],
        }));
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
        if (!selectedItem.includes(item)) {
            if (!isParent) { // remove precedent parent and add child
                const prev = selectedItem.pop();
                newSelectedItem = [...selectedItem, {...prev, child: item}];

                setFilters(newSelectedItem);
            }
            // if is parent, simply add
            else {
                newSelectedItem = [...selectedItem, {parent: item, child: '', uuid: uuidv4()}];
            }
        }

        // calculate if in parentMode
        const isInParentMode = parentSuggestions.map(o => o.label).includes(item);

        // setItem in redux, and launch related sagas for fetching list if needed
        setItem(isInParentMode ? item : '');

        this.setState(state => ({
            ...state,
            isParent: !isInParentMode,
            inputValue: '',
            selectedItem: newSelectedItem,
        }));
    };

    handleDelete = item => () => {
        const {setFilters} = this.props;
        const {selectedItem} = this.state;

        const newSelectedItems = selectedItem.filter(o => o.uuid !== item.uuid);

        setFilters(newSelectedItems);

        this.setState(state => ({
            ...state,
            selectedItem: newSelectedItems,
        }));
    };

    handleOuterClick = (e) => {
        this.setState(state => ({
            ...state,
            inputValue: '',
        }));
    };

    clear = () => {
        const {setFilters, setItem} = this.props;

        setFilters([]);
        setItem('');

        this.setState(state => ({
            ...state,
            selectedItem: [],
            isParent: true,
        }));
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
                    {...props}
                />
            </SearchInputWrapper>
        );
    };

    render() {
        const {inputValue, selectedItem} = this.state;

        return (
            <Wrapper>
                <Downshift
                    inputValue={inputValue}
                    onChange={this.handleChange}
                    onOuterClick={this.handleOuterClick}
                    selectedItem={selectedItem}
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
    filters: getFilters(state),
    ...ownProps,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFilters: actions.filters.set,
    setItem: actions.item.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Search);
