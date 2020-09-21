import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../../../../../common/selector';
import Tabs from './index';
import actions from '../../../../actions';


const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    descForbidden: state[model].item.descLoading,
    tabIndex: state[model].item.tabIndex,
    leaderboardLoading: state[model].item.leaderboardLoading,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setTabIndex: actions.item.tabIndex.set,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'descLoading', 'descForbidden', 'tabIndex'])(Tabs));
