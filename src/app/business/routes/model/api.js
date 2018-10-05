import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('model');
export const fetchItemApi = fetchEntityFactory('model');

export default {
    fetchListApi,
    fetchItemApi,
};
