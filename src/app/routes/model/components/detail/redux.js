import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../selector';
import Detail from './index';

const mapStateToProps = (state, {
    model, filterUp, addNotification,
}) => ({
    item: getItem(state, model),
    filterUp,
    addNotification,
});


export const withDetailRedux = (Component) => connect(mapStateToProps)(onlyUpdateForKeys(['item'])(Component));

export default withDetailRedux(Detail);
