import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import {SearchBar} from '@substrafoundation/substra-ui';

import ComplexSearchToggle from './complexSearchToggle';

import {
    getSearchFilters, getSuggestions, getParentSuggestions, getIsInParentMode,
} from '../selector';

import actions from '../actions';
import withInjectedReducers from '../../common/components/withInjectedReducers';
import {spacingLarge} from '../../../../../assets/css/variables/spacing';

const mapStateToProps = (state) => ({
    inputValue: state.search.inputValue,
    selectedItem: state.search.selectedItem,
    isParent: state.search.isParent,
    location: state.location,
    item: state.search.item,
    suggestions: getSuggestions(state),
    parentSuggestions: getParentSuggestions(state),
    isInParentMode: getIsInParentMode(state),
    filters: getSearchFilters(state),
    placeholder: 'Add item filters. Ex: "objective: objective1", "dataset: dataset2"',
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setState: actions.state.set,
}, dispatch);

const ReduxSearchBar = withInjectedReducers(connect(mapStateToProps, mapDispatchToProps)(SearchBar));

const Wrapper = styled('div')`
    margin: 0 ${spacingLarge};
`;

export default () => (
    <Wrapper>
        <ReduxSearchBar />
        <ComplexSearchToggle />
    </Wrapper>
);
