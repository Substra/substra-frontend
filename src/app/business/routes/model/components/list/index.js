import React from 'react';

import List from '../../../../common/components/list';
import {withListRedux} from './redux';
import {withListAnalytics} from '../../../../common/components/list/analytics';
import Title from './components/title';
import Metadata from './components/metadata';
import PopoverItems from './components/popoverItems';
import Sort from './components/sort';

class ModelList extends List {
    filterUp = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const {filterUp, logFilterFromList} = this.props;
        const {popover: {item: {traintuple: {outModel: {hash}}}}} = this.state;

        filterUp(hash);
        logFilterFromList(hash);

        this.popoverHandleClose();
    };
}

const ModelListWithLocalComponents = props => (
    <ModelList
        Title={Title}
        Metadata={Metadata}
        PopoverItems={PopoverItems}
        Sort={Sort}
        {...props}
    />
);

export default withListRedux(withListAnalytics(ModelListWithLocalComponents));
