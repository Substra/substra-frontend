import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

const fetchStandardAlgoListApi = fetchEntitiesFactory('algo');
const fetchCompositeAlgoListApi = fetchEntitiesFactory('composite_algo');

export function fetchListApi(...args) {
    const promises = [
        fetchStandardAlgoListApi(...args),
        fetchCompositeAlgoListApi(...args),
    ];
    return Promise.all(promises);
}

const fetchStandardAlgoApi = fetchEntityFactory('algo');
const fetchCompositeAlgoApi = fetchEntityFactory('composite_algo');

export function fetchItemApi(...args) {
    fetchStandardAlgoApi(...args);
    fetchCompositeAlgoApi(...args);
}

export default {
    fetchListApi,
    fetchItemApi,
};
