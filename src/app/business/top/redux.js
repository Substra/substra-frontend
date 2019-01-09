import {connect} from 'react-redux';

import Top from './index';

const mapStateToProps = state => ({
    location: state.location,
});

export default connect(mapStateToProps)(Top);
