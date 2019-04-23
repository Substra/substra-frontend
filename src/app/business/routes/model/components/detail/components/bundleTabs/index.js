import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import {noop} from 'lodash';

import ModelSummary from '../modelSummary';
import BundleSummary from '../bundleSummary';


function BundleModelTabs(props) {
    const {item: {models}, downloadItem, addNotification} = props;

    return (
        <Fragment>
            <BundleSummary models={models} downloadItem={downloadItem} />
            {models.map(model => (
                <ModelSummary
                    key={model.traintuple.key}
                    model={model}
                    downloadItem={downloadItem}
                    addNotification={addNotification}
                />
            ))}
        </Fragment>
    );
}

BundleModelTabs.propTypes = {
    item: PropTypes.shape(),
    downloadItem: PropTypes.func,
    addNotification: PropTypes.func,
};

BundleModelTabs.defaultProps = {
    item: null,
    downloadItem: noop,
    addNotification: noop,
};

export default BundleModelTabs;
