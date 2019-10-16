/* globals  localStorage, fetch API_URL */

export function fetchSignIn(username, password) {
    return fetch(`${API_URL}/user/login/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json;version=0.0',
            'Content-Type': 'application/json;',
        },
        body: JSON.stringify({
            username,
            password,
        }),
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        mode: 'cors',
    })
        .then((response) => {
            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return response.text().then(result => Promise.reject(new Error(result)));
                }

                    return response.text().then(() => Promise.reject(new Error('Error, Please dial in json with the api server (Make sure you have deactivated mod header)')));
            }

            return response.json();
        })
        .then(json => ({res: json}), error => ({
            error,
        }));
}


export function fetchSignOut() {
    return fetch(`${API_URL}/user/logout/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json;version=0.0',
            'Content-Type': 'application/json;',
        },
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
        mode: 'cors',
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then(result => Promise.reject(new Error(result)));
            }

            return response.json();
        })
        .then(json => ({res: json}), error => ({
            error,
        }));
}

export const storeLocalUser = ({payload}) => {
    localStorage.setItem('payload', payload);
};

export const removeLocalUser = () => {
    // user
    localStorage.removeItem('payload');
};
