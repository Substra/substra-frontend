import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../selector';
import Detail from './index';

const mapStateToProps = (state, {
    model, filterUp, downloadFile, addNotification,
}) => ({
    item: getItem(state, model),
    descLoading: state[model].item.descLoading,
    filterUp,
    downloadFile,
    addNotification,
});


export default connect(mapStateToProps)(onlyUpdateForKeys(['item', 'className', 'descLoading'])(Detail));
