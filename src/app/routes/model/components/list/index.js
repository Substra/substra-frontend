import React from 'react';

import List from '../../../../common/components/list';
import Title from './components/title';
import Metadata from './components/metadata';
import Sort from './components/sort';
import Actions from './components/actions';

const ModelListWithLocalComponents = (props) => (
    <List
        Title={Title}
        Metadata={Metadata}
        Sort={Sort}
        Actions={Actions}
        {...props}
    />
);

export default ModelListWithLocalComponents;
