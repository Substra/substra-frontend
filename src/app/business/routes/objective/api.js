import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('objective');
export const fetchItemApi = fetchEntityFactory('objective');

export default {
    fetchListApi,
    fetchItemApi,
};
