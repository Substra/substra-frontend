import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import challengeActions from '../../../../challenge/actions';
import datasetActions from '../../../../dataset/actions';
import modelActions from '../../../../model/actions';

import {
    BrowseRelatedLink,
    BrowseRelatedLinksWrapper,
} from '../../../../../common/components/detail/components/browseRelatedLinks';


const BrowseRelatedLinks = ({
                                item, unselectChallenge, unselectDataset, unselectModel, ...props
                            }) => {
    const filter = `algo:name:${item ? item.name : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
            <BrowseRelatedLink model="challenge" label="challenge" filter={filter} unselect={unselectChallenge}/>
            <BrowseRelatedLink model="dataset" label="dataset" filter={filter} unselect={unselectDataset}/>
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
    unselectChallenge: challengeActions.list.unselect,
    unselectDataset: datasetActions.list.unselect,
    unselectModel: modelActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
