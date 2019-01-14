import React from 'react';
import PropTypes from 'prop-types';

import Detail from '../../../../common/components/detail';
import {withDetailRedux} from '../../../../common/components/detail/redux';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import Title from './components/title';
import Traintuple from './components/traintuple';


class ModelDetail extends Detail {
    filterUp = o => (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {item, filterUp, logFilterFromDetail} = this.props;
        filterUp(item.key);
        logFilterFromDetail(item.key);
    };
}

const ModelDetailWithLocalComponents = ({item, ...rest}) => (
    <ModelDetail
        Title={Title}
        item={item}
        {...rest}
    >
        <Traintuple traintuple={item} />
    </ModelDetail>
);

ModelDetailWithLocalComponents.propTypes = {
    item: PropTypes.shape(),
};

ModelDetailWithLocalComponents.defaultProps = {
    item: null,
};

export default withDetailRedux(withDetailAnalytics(ModelDetailWithLocalComponents));
