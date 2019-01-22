import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../selector';
import DetailWithAnalytics from './analytics';

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    filterUp,
    downloadFile,
    addNotification,
});


export const withDetailRedux = Component => connect(mapStateToProps)(onlyUpdateForKeys(['item', 'descLoading'])(Component));

export default withDetailRedux(DetailWithAnalytics);
