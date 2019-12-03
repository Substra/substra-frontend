import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

const fetchStandardAlgoListApi = fetchEntitiesFactory('algo');
const fetchCompositeAlgoListApi = fetchEntitiesFactory('composite_algo');
const fetchAggregateAlgoListApi = fetchEntitiesFactory('aggregate_algo');

export function fetchListApi(...args) {
    const promises = [
        fetchStandardAlgoListApi(...args),
        fetchCompositeAlgoListApi(...args),
        fetchAggregateAlgoListApi(...args),
    ];
    return Promise.all(promises);
}

export const fetchStandardAlgoApi = fetchEntityFactory('algo');
export const fetchCompositeAlgoApi = fetchEntityFactory('composite_algo');
export const fetchAggregateAlgoApi = fetchEntityFactory('aggregate_algo');

export default {
    fetchListApi,
    fetchStandardAlgoApi,
    fetchCompositeAlgoApi,
    fetchAggregateAlgoApi,
};
