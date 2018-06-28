/* globals API_URL fetch */

import {fetchEntitiesFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('model');

export default {
    fetchListApi,
}
