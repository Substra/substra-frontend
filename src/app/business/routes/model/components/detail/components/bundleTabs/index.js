import React from 'react';
import PropTypes from 'prop-types';

import {noop} from 'lodash';

import ModelSummary from '../modelSummary';
import BundleSummary from '../bundleSummary';


function BundleModelTabs(props) {
    const {item: {models}, addNotification} = props;

    return (
        <>
            <BundleSummary models={models} />
            {models.map((model) => (
                <ModelSummary
                    key={model.traintuple.key}
                    model={model}
                    addNotification={addNotification}
                />
            ))}
        </>
    );
}

BundleModelTabs.propTypes = {
    item: PropTypes.shape(),
    addNotification: PropTypes.func,
};

BundleModelTabs.defaultProps = {
    item: null,
    addNotification: noop,
};

export default BundleModelTabs;
