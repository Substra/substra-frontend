import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import Tabs from './index';
import {getItem} from '../../../../../../common/selector';
import actions from '../../../../actions';


const mapStateToProps = (state, {model, addNotification}) => ({
    item: getItem(state, model),
    loading: state[model].item.loading,
    descLoading: state[model].item.descLoading,
    descForbidden: state[model].item.descForbidden,
    openerLoading: state[model].item.openerLoading,
    openerForbidden: state[model].item.openerForbidden,
    tabIndex: state[model].item.tabIndex,
    addNotification,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setTabIndex: actions.item.tabIndex.set,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'loading', 'descLoading', 'descForbidden', 'openerLoading', 'openerForbidden', 'tabIndex'])(Tabs));
