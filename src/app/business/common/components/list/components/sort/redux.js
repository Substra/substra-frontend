import {connect} from 'react-redux';

import Sort from './index';


const mapStateToProps = (state, {model}) => ({
    order: state[model].order,
    location: state.location,
});

const ReduxSort = connect(mapStateToProps)(Sort);

export default ReduxSort;
