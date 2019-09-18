import {NOT_FOUND} from 'redux-first-router';

export default {
    HOME: {path: '/'},
    OBJECTIVE: {path: '/objective'},
    DATASET: {path: '/dataset'},
    ALGORITHM: {path: '/algorithm'},
    MODEL: {path: '/model'},
    USER: {path: '/user'},
    [NOT_FOUND]: {path: '/404'},
};
