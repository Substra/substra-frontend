/* globals PRODUCTION_BASE_NAME */
import {NOT_FOUND} from 'redux-first-router';
import cookie from 'cookie-parse';
import atob from 'atob';
import isBefore from 'date-fns/isBefore';

import configureStore from '../common/configureStore';

const doesRedirect = ({kind, pathname, search}, ctx) => {
    if (kind === 'redirect') {
        ctx.redirect(search ? `${pathname}?${search}` : pathname);
        return true;
    }
};

export default async (ctx) => {
    let preLoadedState = {};

    if (ctx.req.headers.cookie) {
        const cookies = cookie.parse(ctx.req.headers.cookie);
        const headerPayload = cookies['header.payload'];

        if (headerPayload) {
            let payload;
            try {
                payload = JSON.parse(atob(headerPayload.split('.')[1]));
            }
            catch (e) {
                payload = {};
            }

            const authenticated = isBefore(new Date(payload.exp), new Date());
            preLoadedState = {
                user: {
                    authenticated,
                    error: false,
                    loading: false,
                    refreshLoading: false,
                    init: authenticated,
                    exp: payload.exp,
                    payload: null,
                },
            };
        }
    }

    const {store, thunk} = configureStore(preLoadedState, [ctx.originalUrl], {
        basename: PRODUCTION_BASE_NAME,
    });

    // if not using onBeforeChange + jwTokens, you can also async authenticate
    // here against your db (i.e. using req.cookies.sessionId)


    // the idiomatic way to handle redirects
    // serverRender.js will short-circuit since the redirect is made here already
    const location = store.getState().location;

    if (doesRedirect(location, ctx)) return false;

    // using redux-thunk perhaps request and dispatch some app-wide state as well, e.g:
    // await Promise.all([store.dispatch(myThunkA), store.dispatch(myThunkB)])

    await thunk(store); // THE PAYOFF BABY!

    // the idiomatic way to handle routes not found :)
    // your component's should also detect this state and render a 404 scene
    ctx.status = location.type === NOT_FOUND && (!location.query || (location.query && !location.query['_sw-precache'])) ? 404 : 200;

    return store;
};
