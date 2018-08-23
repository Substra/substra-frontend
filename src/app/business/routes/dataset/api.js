import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('dataset');
export const fetchItemApi = fetchEntityFactory('dataset');

export default {
    fetchListApi,
    fetchItemApi,
};
