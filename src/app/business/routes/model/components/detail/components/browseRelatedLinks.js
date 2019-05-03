import React, {Fragment} from 'react';
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
    const modelHash = item && item.traintuple && item.traintuple.outModel && item.traintuple.outModel.hash;
    let algoFilter,
        objectiveFilter,
        datasetFilter;
    if (modelHash) {
        algoFilter = objectiveFilter = datasetFilter = `model:hash:${modelHash}`;
    }
    else {
        algoFilter = `algo:name:${item && item.traintuple && item.traintuple.algo ? encodeURIComponent(item.traintuple.algo.name) : ''}`;
        objectiveFilter = item && item.traintuple && item.traintuple.objective && `objective:key:${item.traintuple.objective.hash}`;
        datasetFilter = [
            item.traintuple,
            ...(item.testtuple ? [item.traintuple] : []),
            ...(item.nonCertifiedTesttuples ? item.nonCertifiedTesttuples : []),
        ]
            .reduce((keys, tuple) => {
                const key = tuple && tuple.dataset && tuple.dataset.openerHash;
                return [
                    ...keys,
                    ...(key ? [`dataset:key:${key}`] : []),
                ];
            }, [])
            .join('-OR-');
    }

    return (
        <Fragment>
            <BrowseRelatedLink model="algo" label="algorithm" filter={algoFilter} unselect={unselectAlgo} />
            {objectiveFilter && <BrowseRelatedLink model="objective" label="objective" filter={objectiveFilter} unselect={unselectObjective} />}
            {datasetFilter && <BrowseRelatedLink model="dataset" label="dataset(s)" filter={datasetFilter} unselect={unselectDataset} />}
        </Fragment>
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
