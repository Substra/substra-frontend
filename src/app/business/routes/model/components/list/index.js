import React from 'react';

import List from '../../../../common/components/list';
import {withListRedux} from '../../../../common/components/list/redux';
import {withListAnalytics} from '../../../../common/components/list/analytics';
import Title from './components/title';
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

const options = [
    {value: {by: 'testData.perf', direction: 'asc'}, label: 'LOWEST SCORE'},
    {value: {by: 'testData.perf', direction: 'desc'}, label: 'HIGHEST SCORE'},
];

const ModelListWithLocalComponents = props => (
    <ModelList
        Title={Title}
        Metadata={Metadata}
        PopoverItems={PopoverItems}
        options={options}
        {...props}
    />
);

export default withListRedux(withListAnalytics(ModelListWithLocalComponents));
