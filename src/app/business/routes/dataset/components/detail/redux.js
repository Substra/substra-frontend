import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import DatasetDetail from './index';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import {getItem} from '../../../../common/selector';
import actions from '../../actions';


const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    openerLoading: state[model].item.openerLoading,
    tabIndex: state[model].item.tabIndex,
    filterUp,
    downloadFile,
    addNotification,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTabIndex: actions.item.tabIndex.set,
}, dispatch);

const DatasetDetailWithAnalytics = withDetailAnalytics(DatasetDetail);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item', 'descLoading', 'openerLoading', 'tabIndex'])(DatasetDetailWithAnalytics));
