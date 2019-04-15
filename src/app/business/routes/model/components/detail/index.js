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
    filterUp = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {item, filterUp, logFilterFromDetail} = this.props;
        filterUp(item.traintuple.outModel.hash);
        logFilterFromDetail(item.traintuple.outModel.hash);
    };
}

class BundleModelDetail extends Detail {
    // filterUp = o => (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //
    //     const {item, filterUp, logFilterFromDetail} = this.props;
    //     filterUp(o);
    //     logFilterFromDetail(item.key);
    // };
}

const ModelDetailWithLocalComponents = (props) => {
    const {item: {tag}} = props;
    const ModelDetailComponent = tag ? BundleModelDetail : ModelDetail;
    const MetadataComponent = tag ? BundleMetadata : Metadata;
    const TabsComponent = tag ? BundleTabs : Tabs;
    return (
        <ModelDetailComponent
            {...props}
            Title={Title}
            Actions={Actions}
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
