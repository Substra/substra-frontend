import {fetchEntitiesFactory, fetchEntityFactory} from '../../utils/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('objective');
export const fetchItemApi = fetchEntityFactory('objective');

export default {
    fetchListApi,
    fetchItemApi,
};
