import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {noop} from 'lodash';

import algoActions from '../../../../algo/actions';
import challengeActions from '../../../../challenge/actions';
import datasetActions from '../../../../dataset/actions';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';
import BrowseRelatedLinksWrapper from '../../../../../common/components/detail/components/browseRelatedLinksWrapper';

const BrowseRelatedLinks = ({
                                item, unselectAlgo, unselectChallenge, unselectDataset,
                                ...props
                            }) => {
    const algoFilter = `algo:name:${item && item.algo ? item.algo.name : ''}`;
    const challengeFilter = `challenge:key:${item && item.challenge ? item.challenge.hash : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
            <BrowseRelatedLink model="algo" label="algorithm" filter={algoFilter} unselect={unselectAlgo}/>
            <BrowseRelatedLink model="challenge" label="challenge" filter={challengeFilter} unselect={unselectChallenge}/>
            <BrowseRelatedLink model="dataset" label="dataset" filter={challengeFilter} unselect={unselectDataset}/>
        </BrowseRelatedLinksWrapper>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
    unselectAlgo: PropTypes.func,
    unselectChallenge: PropTypes.func,
    unselectDataset: PropTypes.func,
};

BrowseRelatedLinks.defaultProps = {
    item: null,
    unselectAlgo: noop,
    unselectChallenge: noop,
    unselectDataset: noop,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    unselectAlgo: algoActions.list.unselect,
    unselectChallenge: challengeActions.list.unselect,
    unselectDataset: datasetActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
