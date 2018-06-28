/* globals API_URL fetch */

import {fetchEntitiesFactory} from '../../../entities/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('algo');

export default {
    fetchListApi,
}
