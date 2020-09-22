/* global API_URL */
import {fetchEntitiesFactory, fetchEntityFactory, fetchJson} from '../../utils/fetchEntities';

export const fetchListApi = fetchEntitiesFactory('objective');
export const fetchItemApi = fetchEntityFactory('objective');

export const fetchItemLeaderboardApi = (key, jwt) => {
    const url = `${API_URL}/objective/${key}/leaderboard/`;
    return fetchJson(url, jwt);
};

export default {
    fetchListApi,
    fetchItemApi,
    fetchItemLeaderboardApi,
};
