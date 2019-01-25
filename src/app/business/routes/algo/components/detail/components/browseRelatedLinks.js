import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {noop} from 'lodash';

import challengeActions from '../../../../challenge/actions';
import datasetActions from '../../../../dataset/actions';
import modelActions from '../../../../model/actions';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';
import BrowseRelatedLinksWrapper from '../../../../../common/components/detail/components/browseRelatedLinksWrapper';


const BrowseRelatedLinks = ({
                                item, unselectChallenge, unselectDataset, unselectModel,
                                ...props
                            }) => {
    const filter = `algo:name:${item ? item.name : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
            <BrowseRelatedLink model="challenge" label="challenge" filter={filter} unselect={unselectChallenge} />
            <BrowseRelatedLink model="dataset" label="dataset" filter={filter} unselect={unselectDataset} />
            <BrowseRelatedLink model="model" label="models" filter={filter} unselect={unselectModel} />
        </BrowseRelatedLinksWrapper>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
    unselectChallenge: PropTypes.func,
    unselectDataset: PropTypes.func,
    unselectModel: PropTypes.func,
};


BrowseRelatedLinks.defaultProps = {
    item: null,
    unselectChallenge: noop,
    unselectDataset: noop,
    unselectModel: noop,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    unselectChallenge: challengeActions.list.unselect,
    unselectDataset: datasetActions.list.unselect,
    unselectModel: modelActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
