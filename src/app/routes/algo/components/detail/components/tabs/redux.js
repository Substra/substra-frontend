import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import Tabs from './index';
import {getItem} from '../../../../../../common/selector';
import actions from '../../../../actions';

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    descForbidden: state[model].item.descForbidden,
    tabIndex: state[model].item.tabIndex,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setTabIndex: actions.item.tabIndex.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'descLoading', 'descForbidden', 'tabIndex'])(Tabs));
