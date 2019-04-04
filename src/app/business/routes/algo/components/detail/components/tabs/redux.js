import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import Tabs from './index';
import {getItem} from '../../../../../../common/selector';

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
});

export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'descLoading'])(Tabs));
