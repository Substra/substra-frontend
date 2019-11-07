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

export const fetchStandardAlgoApi = fetchEntityFactory('algo');
export const fetchCompositeAlgoApi = fetchEntityFactory('composite_algo');

export default {
    fetchListApi,
    fetchStandardAlgoApi,
    fetchCompositeAlgoApi,
};
