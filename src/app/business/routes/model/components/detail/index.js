import React from 'react';
import PropTypes from 'prop-types';
import Detail from '../../../../common/components/detail';
import Title from './components/title';
import Metadata from './components/metadata';
import BundleMetadata from './components/bundleMetadata';
import Tabs from './components/tabs/redux';
import BundleTabs from './components/bundleTabs/redux';
import Actions from './components/actions';

class ModelDetail extends Detail {
    filterUp = (o) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {item, filterUp} = this.props;
        filterUp(item.traintuple.key);
    };
}

const ModelDetailWithLocalComponents = (props) => {
    const {item: {tag}} = props;
    const MetadataComponent = tag ? BundleMetadata : Metadata;
    const TabsComponent = tag ? BundleTabs : Tabs;
    const ActionsComponent = tag ? () => null : Actions;
    return (
        <ModelDetail
            {...props}
            Title={Title}
            Actions={ActionsComponent}
            Metadata={MetadataComponent}
            Tabs={TabsComponent}
        />
    );
};

ModelDetailWithLocalComponents.propTypes = {
    item: PropTypes.shape(),
};

ModelDetailWithLocalComponents.defaultProps = {
    item: null,
};

export default ModelDetailWithLocalComponents;
