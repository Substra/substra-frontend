/* global API_URL fetch */

import queryString from 'query-string';
import {isEmpty} from 'lodash';

export const getHeaders = (jwt) => ({
    Accept: 'application/json;version=0.0',
    'Content-Type': 'application/json;',
    ...(jwt ? {Authorization: `JWT ${jwt}`} : {}),
});

export const handleResponse = (response) => {
    if (!response.ok) {
        return response.text().then((result) => Promise.reject(new Error(result)));
    }

    return response.json();
};

export const fetchList = (url, jwt) => {
    const headers = getHeaders(jwt);

    let status;

    return fetch(url, {
        headers,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        mode: 'cors',
    })
        .then((response) => {
            status = response.status;
            return handleResponse(response);
        })
        .then((json) => ({list: json, status}), (error) => ({error, status}));
};

export const fetchEntitiesFactory = (path) => (get_parameters, jwt) => {
    const url = `${API_URL}/${path}/${!isEmpty(get_parameters) ? `?${queryString.stringify(get_parameters)}` : ''}`;
    return fetchList(url, jwt);
};

export const fetchEntitiesByPathFactory = (path, view) => (get_parameters, id, jwt) => {
    const url = `${API_URL}/${path}/${id ? `${id}/` : ''}${view}/${!isEmpty(get_parameters)
        ? `?${queryString.stringify(get_parameters)}`
        : ''}`;
    return fetchList(url, jwt);
};

export const fetchRaw = (url, jwt) => {
    const headers = getHeaders(jwt);

    let status;

    return fetch(url, {
        headers,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        mode: 'cors',
    })
        .then((response) => {
            status = response.status;
            if (!response.ok) {
                return response.text().then((result) => Promise.reject(new Error(result)));
            }

            return response.text(); // /!\ Note the text, not json
        })
        .then((res) => ({res, status}), (error) => ({error, status}));
};

export const fetchEntityFactory = (path) => (get_parameters, id, jwt) => {
    const headers = getHeaders(jwt);
    const url = `${API_URL}/${path}/${id}/${!isEmpty(get_parameters)
        ? `?${queryString.stringify(get_parameters)}`
        : ''}`;

    let status;

    return fetch(url, {
        headers,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        mode: 'cors',
    })
        .then((response) => {
            status = response.status;
            return handleResponse(response);
        })
        .then((json) => ({item: json, status}), (error) => ({error, status}));
};
