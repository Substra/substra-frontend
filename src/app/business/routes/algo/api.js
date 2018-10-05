import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('algo');
export const fetchItemApi = fetchEntityFactory('algo');

export default {
    fetchListApi,
    fetchItemApi,
};
