import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {noop} from 'lodash';

import algoActions from '../../../../algo/actions';
import objectiveActions from '../../../../objective/actions';
import datasetActions from '../../../../dataset/actions';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';

const BrowseRelatedLinks = ({
                                item, unselectAlgo, unselectObjective, unselectDataset,
                            }) => {
    const algoFilter = `algo:name:${item && item.traintuple && item.traintuple.algo ? item.traintuple.algo.name : ''}`;
    const objectiveFilter = `objective:key:${item && item.traintuple && item.traintuple.objective ? item.traintuple.objective.hash : ''}`;

    return (
        <React.Fragment>
            <BrowseRelatedLink model="algo" label="algorithm" filter={algoFilter} unselect={unselectAlgo} />
            <BrowseRelatedLink model="objective" label="objective" filter={objectiveFilter} unselect={unselectObjective} />
            <BrowseRelatedLink model="dataset" label="dataset" filter={objectiveFilter} unselect={unselectDataset} />
        </React.Fragment>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
    unselectAlgo: PropTypes.func,
    unselectObjective: PropTypes.func,
    unselectDataset: PropTypes.func,
};

BrowseRelatedLinks.defaultProps = {
    item: null,
    unselectAlgo: noop,
    unselectObjective: noop,
    unselectDataset: noop,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    unselectAlgo: algoActions.list.unselect,
    unselectObjective: objectiveActions.list.unselect,
    unselectDataset: datasetActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
