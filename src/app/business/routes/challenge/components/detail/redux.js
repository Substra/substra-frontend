import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../../../common/selector';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import ChallengeDetail from './index';


const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    metricsLoading: state[model].item.metricsLoading,
    filterUp,
    downloadFile,
    addNotification,
});


const ChallengeDetailWithAnalytics = withDetailAnalytics(ChallengeDetail);
export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'descLoading', 'metricsLoading'])(ChallengeDetailWithAnalytics));
