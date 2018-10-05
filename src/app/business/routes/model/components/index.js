import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import actions from '../actions';

import Base from './base';
import List from './list';
import Detail from './detail';
import {getItem} from '../../../common/selector';
import searchActions from '../../../search/actions';
import {getChallengeFilters} from '../selector';

// Custom with added Chart
const ReduxBase = (B = Base) => { // no override on List/Detail, neither principal Component
    const mapStateToProps = (state, {model, actions, download}) => ({
        selected: state[model].list.selected,
        results: state[model].list.results,
        selectedItem: state.search.selectedItem,
        model,
        actions,
        download,
        item: getItem(state, model),
        challengeFilters: getChallengeFilters(state),
        chart: state[model].chart,
    });

    const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
        setSearchState: searchActions.state.set,
        fetchFile: actions.item.file.request,
    }, dispatch);

    return connect(mapStateToProps, mapDispatchToProps)(B);
};

const ReduxModelBase = ReduxBase(Base);

const download = {
    filename: 'model',
    address: ['endModel', 'storageAddress'],
    text: 'Download endModel',
};

const Model = () => (
    <ReduxModelBase
        actions={actions}
        model="model"
        download={download}
        List={List}
        Detail={Detail}
    />
);

export default Model;
