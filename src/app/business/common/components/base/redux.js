import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

// Basic customisable redux mapping
import {getItem} from '../../selector';
import searchActions from '../../../search/actions';
import BaseWithAnalytics from './analytics';

const ReduxBase = (B = BaseWithAnalytics) => { // no override on List/Detail, neither principal Component
    const mapStateToProps = (state, {model, actions, download}) => ({
        selected: state[model].list.selected,
        results: state[model].list.results,
        selectedItem: state.search.selectedItem,
        model,
        actions,
        download,
        item: getItem(state, model),
    });

    const mapDispatchToProps = (dispatch, {actions}) => bindActionCreators({
        setSearchState: searchActions.state.set,
        fetchFile: actions.item.file.request,
    }, dispatch);

    return connect(mapStateToProps, mapDispatchToProps)(B);
};

export default ReduxBase;
