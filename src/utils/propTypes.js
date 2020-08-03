import RootPropTypes from 'prop-types';
import {isValidElementType} from 'react-is';


/*
 * Custom component propTypes
 * Adapted from https://github.com/facebook/react/issues/5143 and https://github.com/facebook/react/issues/9125
 */
const createComponentPropType = isRequired => (props, propName, componentName) => {
    const prop = props[propName];
    if (!prop && isRequired) {
        throw new Error(`Missing required prop ${propName}`);
    }
    else if (prop && !isValidElementType(prop)) {
        return new Error(`Invalid prop '${propName}' supplied to '${componentName}': the prop is not a valid React component`);
    }
};

const componentPropType = createComponentPropType(false);
componentPropType.isRequired = createComponentPropType(true);


const PropTypes = {
    ...RootPropTypes,
    component: componentPropType,
};

export default PropTypes;
