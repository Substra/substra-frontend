import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import challengeActions from '../../../../challenge/actions';
import algoActions from '../../../../algo/actions';
import modelActions from '../../../../model/actions';

import {
    BrowseRelatedLink,
    BrowseRelatedLinksWrapper,
} from '../../../../../common/components/detail/components/browseRelatedLinks';

const BrowseRelatedLinks = ({
                                item, unselectAlgo, unselectChallenge, unselectModel, ...props
                            }) => {
    const filter = `dataset:name:${item ? item.name : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
            <BrowseRelatedLink model="challenge" label="challenges" filter={filter} unselect={unselectChallenge}/>
            <BrowseRelatedLink model="algo" label="algorithms" filter={filter} unselect={unselectAlgo}/>
            <BrowseRelatedLink model="model" label="models" filter={filter} unselect={unselectModel}/>
        </BrowseRelatedLinksWrapper>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
};

BrowseRelatedLinks.defaultProps = {
    item: null,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    unselectAlgo: algoActions.list.unselect,
    unselectChallenge: challengeActions.list.unselect,
    unselectModel: modelActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
