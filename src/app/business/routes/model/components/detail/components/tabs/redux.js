import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../../../selector';
import Tabs from './index';

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
    loading: state[model].item.loading,
});


export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'loading'])(Tabs));
