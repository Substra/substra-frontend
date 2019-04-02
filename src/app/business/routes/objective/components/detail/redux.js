import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../../../common/selector';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import ObjectiveDetail from './index';
import actions from '../../actions';


const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    metricsLoading: state[model].item.metricsLoading,
    tabIndex: state[model].item.tabIndex,
    filterUp,
    downloadFile,
    addNotification,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTabIndex: actions.item.tabIndex.set,
}, dispatch);

const ObjectiveDetailWithAnalytics = withDetailAnalytics(ObjectiveDetail);
export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'descLoading', 'metricsLoading', 'tabIndex'])(ObjectiveDetailWithAnalytics));
