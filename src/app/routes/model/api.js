import {fetchEntitiesFactory, fetchEntityFactory} from '../../utils/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('model');
export const fetchItemApi = fetchEntityFactory('model');

export default {
    fetchListApi,
    fetchItemApi,
};
