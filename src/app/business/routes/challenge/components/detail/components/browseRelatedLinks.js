import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import datasetActions from '../../../../dataset/actions';
import algoActions from '../../../../algo/actions';
import modelActions from '../../../../model/actions';

import {
    BrowseRelatedLink,
    BrowseRelatedLinksWrapper,
} from '../../../../../common/components/detail/components/browseRelatedLinks';


const BrowseRelatedLinks = ({
                                item, unselectAlgo, unselectModel, unselectDataset, ...props
                            }) => {
    const filter = `challenge:name:${item ? item.name : ''}`;

    return (
        <BrowseRelatedLinksWrapper {...props}>
            <BrowseRelatedLink model="dataset" label="dataset" filter={filter} unselect={unselectDataset}/>
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
    unselectDataset: datasetActions.list.unselect,
    unselectModel: modelActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
