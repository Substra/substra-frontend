import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('challenge');
export const fetchItemApi = fetchEntityFactory('challenge');

export default {
    fetchListApi,
    fetchItemApi,
};
