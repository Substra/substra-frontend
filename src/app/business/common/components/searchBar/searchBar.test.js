import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {
    defaultState, getSuggestions,
} from './searchBarJest';

import SearchBar from './searchBar';

const initialStateWithSelectedItem = {
    ...defaultState,
    selectedItem: [{parent: 'AAAA', child: '2', uuid: 'aee83084-fafb-4d26-8144-883c45244183'}],
};

const initialStateWithLocation = {
    ...defaultState,
    location: {query: {search: 'test'}},
};

const initialStateWithSelectedItemAndLocation = {
    ...defaultState,
    selectedItem: [{parent: 'AAAA', child: '2', uuid: 'aee83084-fafb-4d26-8144-883c45244183'}],
    location: {query: {search: 'test'}},
};

const renderSearchBar = (initialState = defaultState) => {
    const reducer = (state = initialState, {type, payload}) => {
        switch (type) {
            case 'SET':
                return {
                    ...state,
                    ...getSuggestions(state.isParent, state.selectedItem, state.item),
                    ...payload,
                };
            default:
                return {
                    ...state,
                    ...getSuggestions(state.isParent, state.selectedItem, state.item),
                };
        }
    };
    const store = createStore(reducer, initialState);

    const mapStateToProps = ({
inputValue, suggestions, parentSuggestions, isParent, location, selectedItem,
}) => ({
        inputValue,
        suggestions,
        parentSuggestions,
        isParent,
        location,
        selectedItem,
        placeholder: 'Custom placeholder',
    });

    const mapDispatchToProps = dispatch => ({
        setState: payload => dispatch({type: 'SET', payload}),
    });

    const ReduxSearchBar = connect(mapStateToProps, mapDispatchToProps)(SearchBar);
    return render((
        <Provider store={store}>
            <ReduxSearchBar />
        </Provider>

    ));
};

test('The popper is displayed when the searchbar is clicked', () => {
    const {getByTestId} = renderSearchBar();

    expect(getByTestId('popper')).toHaveStyle('display: none;');
    fireEvent.click(getByTestId('searchbar'));
    expect(getByTestId('popper')).toHaveStyle('display: block;');
});

test('The width is 400px when there are no suggestions selected', () => {
    const {getByTestId} = renderSearchBar();

    expect(getByTestId('searchbar')).toHaveStyle('width: 400px;');
});

test('The width isn\'t 400px when there are suggestions selected', () => {
    const {getByTestId} = renderSearchBar(initialStateWithSelectedItem);

    expect(getByTestId('searchbar')).not.toHaveStyle('width: 400px;');
});

test('The placeholder is displayed when there are no selected items', () => {
    const {getByTestId} = renderSearchBar();

    expect(getByTestId('searchbar').placeholder).toEqual('Custom placeholder');
});

test('The placeholder isn\'t displayed when there are selected items', () => {
    const {getByTestId} = renderSearchBar(initialStateWithSelectedItem);

    expect(getByTestId('searchbar').placeholder).toEqual('');
});

test('The clear button remove every selected items', () => {
    const {getByTestId} = renderSearchBar(initialStateWithSelectedItem);

    expect(getByTestId('chip-aee83084-fafb-4d26-8144-883c45244183')).toBeDefined();
    fireEvent.click(getByTestId('button'));
    expect(() => {
        getByTestId('chip-aee83084-fafb-4d26-8144-883c45244183');
    }).toThrow();
});

test('Test if the location is synchronized', () => {
    const {getByText} = renderSearchBar(initialStateWithLocation);

    expect(getByText('test:')).toBeDefined();
});

test('Test if the location overrides selectedItem', () => {
    const {getByText} = renderSearchBar(initialStateWithSelectedItemAndLocation);

    expect(getByText('test:')).toBeDefined();
});
