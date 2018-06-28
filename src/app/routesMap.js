import {NOT_FOUND} from 'redux-first-router';

export default {
    HOME: {path: '/'},
    PROBLEM: {path: '/problem'},
    DATASET: {path: '/dataset'},
    ALGORITHM: {path: '/algorithm'},
    MODEL: {path: '/model'},
    DOC: {path: '/doc'},
    [NOT_FOUND]: {path: '/404'},
};
