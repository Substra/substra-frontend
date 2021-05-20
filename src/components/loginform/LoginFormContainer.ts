import { connect } from 'react-redux';

import { RootState } from '@/store';

import LoginForm from './LoginForm';

const mapStateToProps = (state: RootState) => {
    const { error } = state.user;

    return {
        error,
    };
};

export default connect(mapStateToProps)(LoginForm);
