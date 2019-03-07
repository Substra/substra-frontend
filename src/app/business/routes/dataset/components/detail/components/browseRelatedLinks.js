import React from 'react';
import PropTypes from 'prop-types';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {noop} from 'lodash';

import objectiveActions from '../../../../objective/actions';
import algoActions from '../../../../algo/actions';
import modelActions from '../../../../model/actions';

import BrowseRelatedLink from '../../../../../common/components/detail/components/browseRelatedLink';

const BrowseRelatedLinks = ({
                                item, unselectAlgo, unselectObjective, unselectModel,
                            }) => {
    const filter = `dataset:name:${item ? item.name : ''}`;

    return (
        <React.Fragment>
            <BrowseRelatedLink model="objective" label="objectives" filter={filter} unselect={unselectObjective} />
            <BrowseRelatedLink model="algo" label="algorithms" filter={filter} unselect={unselectAlgo} />
            <BrowseRelatedLink model="model" label="models" filter={filter} unselect={unselectModel} />
        </React.Fragment>
    );
};

BrowseRelatedLinks.propTypes = {
    item: PropTypes.shape(),
    unselectAlgo: PropTypes.func,
    unselectObjective: PropTypes.func,
    unselectModel: PropTypes.func,
};

BrowseRelatedLinks.defaultProps = {
    item: null,
    unselectAlgo: noop,
    unselectObjective: noop,
    unselectModel: noop,
};

const mapDispatchToProps = dispatch => bindActionCreators({
    unselectAlgo: algoActions.list.unselect,
    unselectObjective: objectiveActions.list.unselect,
    unselectModel: modelActions.list.unselect,
}, dispatch);


export default connect(null, mapDispatchToProps)(BrowseRelatedLinks);
