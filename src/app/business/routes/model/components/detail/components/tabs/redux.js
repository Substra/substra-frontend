import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../../../selector';
import Tabs from './index';

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
});


export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'descLoading'])(Tabs));
