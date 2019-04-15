import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {noop} from 'lodash';

import ModelSummary from '../modelSummary';
import BundleSummary from '../bundleSummary';


function BundleModelTabs(props) {
    const {item: {models}, downloadItem} = props;

    return (
        <Fragment>
            <BundleSummary models={models} downloadItem={downloadItem} />
            {models.map(model => (
                <ModelSummary
                    key={model.traintuple.key}
                    model={model}
                    downloadItem={downloadItem}
                />
            ))}
        </Fragment>
    );
}

BundleModelTabs.propTypes = {
    item: PropTypes.shape(),
    downloadItem: PropTypes.func,
};

BundleModelTabs.defaultProps = {
    item: null,
    downloadItem: noop,
};

export default BundleModelTabs;
