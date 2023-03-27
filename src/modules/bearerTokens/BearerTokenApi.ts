import API from '@/libs/request';

const URLS = {
    API_TOKEN: `/api-token`,
    ACTIVE_API_TOKENS: `/active-api-tokens`,
};

export const requestToken = () => {
    return API.authenticatedGet(URLS.API_TOKEN);
};

export const listActiveTokens = () => {
    return API.authenticatedGet(URLS.ACTIVE_API_TOKENS);
};
