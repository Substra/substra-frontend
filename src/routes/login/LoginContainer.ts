import { connect } from 'react-redux';

import { logIn } from '@/modules/user/UserSlice';
import { loginPayload } from '@/modules/user/UserApi';

import { AppDispatch, RootState } from '@/store';

import Login from './Login';

const mapStateToProps = (state: RootState) => {
    const { authenticated } = state.user;

    return {
        authenticated,
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        submitLogin(username: string, password: string) {
            const payload: loginPayload = {
                username,
                password,
            };

            dispatch(logIn(payload));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
