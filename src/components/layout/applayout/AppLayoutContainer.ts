import { connect } from 'react-redux';

import AppLayout from './AppLayout';

import { RootState } from '@/store';

const mapStateToProps = (state: RootState) => {
    const { authenticated } = state.user;

    return {
        authenticated,
    };
};

export default connect(mapStateToProps)(AppLayout);
