import {fetchEntitiesFactory, fetchEntityFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('dataset_manager');
export const fetchItemApi = fetchEntityFactory('dataset_manager');

export default {
    fetchListApi,
    fetchItemApi,
};
