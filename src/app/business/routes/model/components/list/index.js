import React from 'react';

import List from '../../../../common/components/list';
import {withListRedux} from '../../../../common/components/list/redux';
import {withListAnalytics} from '../../../../common/components/list/analytics';
import Title from './components/title';
import Description from './components/description';
import Sort from './components/sort';

class ModelList extends List {
    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp} = this.props;
        const {popover: {item: {key}}} = this.state;

        filterUp(key);

        this.popoverHandleClose();
    };
}

const ModelListWithLocalComponents = props => (
    <ModelList
        Title={Title}
        Description={Description}
        Sort={Sort}
        {...props}
    />
);

export default withListRedux(withListAnalytics(ModelListWithLocalComponents));
