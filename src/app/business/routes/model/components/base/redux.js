import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// Basic customisable redux mapping
import {getItem, getSelected, getOrderedResults} from '../../selector';
import searchActions from '../../../../search/actions';
import Base from './index';
import withInjectedReducers from '../../../../common/components/withInjectedReducers';

const ReduxBase = (B = Base) => { // no override on List/Detail, neither principal Component
    const mapStateToProps = (state, {model, actions, download}) => ({
        selected: getSelected(state, model),
        results: getOrderedResults(state, model),
        selectedItem: state.search.selectedItem,
        model,
        actions,
        download,
        item: getItem(state, model),
    });

    const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
        setSearchState: searchActions.state.set,
        downloadItem: actions.item.download.request,
    }, dispatch);

    return withInjectedReducers(connect(mapStateToProps, mapDispatchToProps)(B));
};

export default ReduxBase;
