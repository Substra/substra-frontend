import {fetchEntitiesFactory, fetchEntitiesByPathFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('model');
export const fetchItemApi = fetchEntitiesByPathFactory('model', 'details');

export default {
    fetchListApi,
    fetchItemApi,
};
