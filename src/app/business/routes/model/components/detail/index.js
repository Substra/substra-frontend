import React from 'react';
import Detail from '../../../../common/components/detail';
import {withDetailRedux} from './redux';
import {withDetailAnalytics} from '../../../../common/components/detail/analytics';
import Title from './components/title';
import Metadata from './components/metadata';
import Tabs from './components/tabs/redux';
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

const ModelDetailWithLocalComponents = props => (
    <ModelDetail
        {...props}
        Title={Title}
        Actions={Actions}
        Metadata={Metadata}
        Tabs={Tabs}
    />
);

export default withDetailRedux(withDetailAnalytics(ModelDetailWithLocalComponents));
