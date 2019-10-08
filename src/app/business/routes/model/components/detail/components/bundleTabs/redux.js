import {connect} from 'react-redux';

import {getItem} from '../../../../selector';
import Tabs from './index';

const mapStateToProps = (state, {model}) => ({
    item: getItem(state, model),
});


// this used to be:
// export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['item'])(Tabs));
// however, onlyUpdateForKeys relies on shallowEqual which doesn't detect deep changes in the item object
// (and the bundle item object is quite complex)
export default connect(mapStateToProps)(Tabs);
