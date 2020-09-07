import {fetchEntitiesFactory, fetchEntityFactory} from '../../utils/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('data_manager');
export const fetchItemApi = fetchEntityFactory('data_manager');

export default {
    fetchListApi,
    fetchItemApi,
};
