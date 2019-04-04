import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import Tabs from './index';
import {getItem} from '../../../../../../common/selector';
import actions from '../../../../actions';


const mapStateToProps = (state, {model, addNotification}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    openerLoading: state[model].item.openerLoading,
    tabIndex: state[model].item.tabIndex,
    addNotification,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTabIndex: actions.item.tabIndex.set,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'descLoading', 'openerLoading', 'tabIndex'])(Tabs));
