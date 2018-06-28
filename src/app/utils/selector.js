import {createSelectorCreator, defaultMemoize} from 'reselect';
import {isEqual} from 'lodash';

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual,
);

export default createDeepEqualSelector;
