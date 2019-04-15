import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';

import {getItem} from '../../../../selector';
import actions from '../../../../actions';
import Tabs from './index';

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    downloadItem: actions.item.download.request,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item'])(Tabs));
