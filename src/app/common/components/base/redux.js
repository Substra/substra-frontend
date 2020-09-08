import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// Basic customisable redux mapping
import {getItem, getSelected} from '../../selector';
import searchActions from '../../../search/actions';
import Base from './index';
import withInjectedReducers from '../withInjectedReducers';

const ReduxBase = (B = Base) => { // no override on List/Detail, neither principal Component
    const mapStateToProps = (state, {model, actions, download}) => ({
        selected: getSelected(state, model),
        results: state[model].list.results,
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
