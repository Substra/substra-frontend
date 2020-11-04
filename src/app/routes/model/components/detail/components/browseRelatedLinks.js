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
    const modelKey = item && item.traintuple && item.traintuple.out_model && item.traintuple.out_model.key;
    const hasPrefix = item && item.traintuple && ['composite', 'aggregate'].includes(item.traintuple.type);
    let algoFilter,
        datasetFilter;
    if (modelKey) {
        algoFilter = datasetFilter = `model:key:${modelKey}`;
    }
    else {
        const algoPrefix = hasPrefix ? `${item.traintuple.type}_algo` : 'algo';
        algoFilter = `${algoPrefix}:name:${item && item.traintuple && item.traintuple.algo ? encodeURIComponent(item.traintuple.algo.name) : ''}`;
        datasetFilter = [
            item.traintuple,
            ...item.testtuples,
        ]
            .reduce((keys, tuple) => {
                const key = tuple && tuple.dataset && tuple.dataset.key;
                return [
                    ...keys,
                    ...(key ? [`dataset:key:${key}`] : []),
                ];
            }, [])
            .join('-OR-');
    }

    return (
        <>
            <BrowseRelatedLink
                model="algo"
                label={hasPrefix ? `${item.traintuple.type} algorithm` : 'algorithm'}
                filter={algoFilter}
                unselect={unselectAlgo}
            />
            {datasetFilter && <BrowseRelatedLink model="dataset" label="dataset(s)" filter={datasetFilter} unselect={unselectDataset} />}
        </>
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
    unselectAlgo: algoActions.list.unselect,
    unselectObjective: objectiveActions.list.unselect,
    unselectDataset: datasetActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
