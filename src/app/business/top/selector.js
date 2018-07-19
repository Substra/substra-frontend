import {NOT_FOUND} from 'redux-first-router';

import createDeepEqualSelector from '../../utils/selector';

const location = state => state.location;

export const getRoutes = createDeepEqualSelector([location],
    // put name in first
    location => Object.keys(location.routesMap).filter(o => ![NOT_FOUND, 'HOME'].includes(o)),
);


export default {
    getRoutes,
};
