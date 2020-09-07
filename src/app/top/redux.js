import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {signOut} from '../user/actions';

import Top from './index';

const mapStateToProps = (state) => ({
    location: state.location,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    signOut: signOut.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Top);
