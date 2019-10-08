import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../selector';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import Detail from './index';

const mapStateToProps = (state, {
    model, filterUp, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    filterUp,
    addNotification,
});


export const withDetailRedux = Component => connect(mapStateToProps)(onlyUpdateForKeys(['item', 'descLoading'])(Component));

export default withDetailRedux(withDetailAnalytics(Detail));
