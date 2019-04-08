import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import DatasetDetail from './index';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import {getItem} from '../../../../common/selector';


const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    filterUp,
    downloadFile,
    addNotification,
});

const DatasetDetailWithAnalytics = withDetailAnalytics(DatasetDetail);

export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'descLoading'])(DatasetDetailWithAnalytics));
