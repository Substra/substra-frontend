import {NOT_FOUND} from 'redux-first-router';

export default {
    HOME: {path: '/'},
    CHALLENGE: {path: '/challenge'},
    DATASET: {path: '/dataset'},
    ALGORITHM: {path: '/algorithm'},
    MODEL: {path: '/model'},
    [NOT_FOUND]: {path: '/404'},
};
