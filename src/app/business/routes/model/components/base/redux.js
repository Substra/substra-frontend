// Custom with added Chart

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import BaseWithAnalytics from './analytics';
import withRedux from '../../../../common/components/withRedux';
import {getItem} from '../../../../common/selector';
import {getChallengeFilters, getData} from '../../selector';
import searchActions from '../../../../search/actions';

const ReduxBase = (B = BaseWithAnalytics) => { // no override on List/Detail, neither principal Component
    const mapStateToProps = (state, {model, actions, download}) => ({
        selected: state[model].list.selected,
        results: state[model].list.results,
        selectedItem: state.search.selectedItem,
        model,
        actions,
        download,
        item: getItem(state, model),
        challengeFilters: getChallengeFilters(state),
        chart: state[model].chart.chart,
        data: getData(state, model),
    });

    const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
        setSearchState: searchActions.state.set,
        fetchFile: actions.item.file.request,
    }, dispatch);

    return withRedux(connect(mapStateToProps, mapDispatchToProps)(B));
};

export default ReduxBase;
