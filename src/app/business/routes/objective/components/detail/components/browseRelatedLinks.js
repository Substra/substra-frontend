import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {noop} from 'lodash';

import datasetActions from '../../../../dataset/actions';
import algoActions from '../../../../algo/actions';
import modelActions from '../../../../model/actions';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';

const BrowseRelatedLinks = ({
                                item, unselectAlgo, unselectModel, unselectDataset,
                                ...props
                            }) => {
    const filter = `objective:name:${item ? encodeURIComponent(item.name) : ''}`;

    return (
        <Fragment {...props}>
            <BrowseRelatedLink model="dataset" label="dataset" filter={filter} unselect={unselectDataset} />
            <BrowseRelatedLink model="model" label="models" filter={filter} unselect={unselectModel} />
        </Fragment>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
    unselectAlgo: PropTypes.func,
    unselectDataset: PropTypes.func,
    unselectModel: PropTypes.func,
};

BrowseRelatedLinks.defaultProps = {
    item: null,
    unselectAlgo: noop,
    unselectDataset: noop,
    unselectModel: noop,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    unselectAlgo: algoActions.list.unselect,
    unselectDataset: datasetActions.list.unselect,
    unselectModel: modelActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
