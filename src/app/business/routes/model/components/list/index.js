import React from 'react';

import List from '../../../../common/components/list';
import {withListRedux} from '../../../../common/components/list/redux';
import {withListAnalytics} from '../../../../common/components/list/analytics';
import Title from './components/title';
import Sort from './components/sort';
import Metadata from './components/metadata';
import PopoverItems from './components/popoverItems';

class ModelList extends List {
    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp, logFilterFromList} = this.props;
        const {popover: {item: {key}}} = this.state;

        filterUp(key);
        logFilterFromList(key);

        this.popoverHandleClose();
    };
}

const ModelListWithLocalComponents = props => (
    <ModelList
        Title={Title}
        Sort={Sort}
        Metadata={Metadata}
        PopoverItems={PopoverItems}
        {...props}
    />
);

export default withListRedux(withListAnalytics(ModelListWithLocalComponents));
