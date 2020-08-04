import React from 'react';
import {storiesOf} from '@storybook/react';
import {StateDecorator, Store} from '@sambego/storybook-state';
import {
    defaultState,
    getSuggestions,
} from './searchBarJest';
import SearchBar from './searchBar';

const store = new Store(defaultState);

let previousState = {...defaultState};

const setState = state => {
    store.set(state);
};

setState({...defaultState, ...getSuggestions(defaultState.isParent, [])});

store.subscribe(state => {
    if (previousState.isParent !== state.isParent || state.item === '-OR-' || (
        !state.selectedItem.length && state.suggestions[0].label === '-OR-'
    )) {
        previousState = {...state};
        store.set({
            ...state,
            ...getSuggestions(state.isParent, state.selectedItem, state.item),
        });
    }
    previousState = {...state};
});
storiesOf('SearchBar', module)
    .addDecorator(StateDecorator(store))
    .add('default', () => (
        <SearchBar
            inputValue={store.get('inputValue')}
            setState={setState}
            suggestions={store.get('suggestions')}
            parentSuggestions={store.get('parentSuggestions')}
            isParent={store.get('isParent')}
            selectedItem={store.get('selectedItem')}
            placeholder="Custom placeholder"
        />
    ));
