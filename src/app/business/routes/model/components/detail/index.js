import React from 'react';
import PropTypes from 'prop-types';
import Detail from '../../../../common/components/detail';
import Title from './components/title';
import Metadata from './components/metadata';
import Tabs from './components/tabs/redux';
import Actions from './components/actions';

class ModelDetail extends Detail {
    filterUp = (o) => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {item, filterUp} = this.props;
        filterUp(item.traintuple.key);
    };
}

const ModelDetailWithLocalComponents = (props) => (
    <ModelDetail
        {...props}
        Title={Title}
        Actions={Actions}
        Metadata={Metadata}
        Tabs={Tabs}
    />
);

ModelDetailWithLocalComponents.propTypes = {
    item: PropTypes.shape(),
};

ModelDetailWithLocalComponents.defaultProps = {
    item: null,
};

export default ModelDetailWithLocalComponents;
