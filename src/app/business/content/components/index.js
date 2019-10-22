import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {replace} from 'redux-first-router';

import Top from '../../top/redux';
import Search from '../../search/components';
import Nav from '../../nav/redux';
import Route from '../../routes';
import withInjectedReducers from '../../common/components/withInjectedReducers';

// export needed reducers and sagas needed for Search
// this is not directly put in seach for not having race condition between react-hot-loader and reducer injection
export objectiveReducer from '../../routes/objective/reducers/index';
export objectiveSagas from '../../routes/objective/sagas/index';
export datasetReducer from '../../routes/dataset/reducers/index';
export datasetSagas from '../../routes/dataset/sagas/index';
export algoReducer from '../../routes/algo/reducers/index';
export algoSagas from '../../routes/algo/sagas/index';
export modelReducer from '../../routes/model/reducers/index';
export modelSagas from '../../routes/model/sagas/index';

const Content = ({page, user}) => {
    if (user && !user.authenticated) {
        replace('/login');
        return null;
    }

    return (
        <Fragment>
            <Top />
            <Search />
            <Nav />
            <Route page={page} />
        </Fragment>
);
};


Content.propTypes = {
    page: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
};

const mapStateToProps = ({location, user}) => ({page: location.type, user});

export default withInjectedReducers(connect(mapStateToProps)(Content));
