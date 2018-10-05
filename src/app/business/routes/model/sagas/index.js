/* global fetch */

import {
    takeLatest, takeEvery, all, select, call, put,
} from 'redux-saga/effects';

import {saveAs} from 'file-saver';

import actions, {actionTypes} from '../actions';
import {fetchListApi, fetchItemApi} from '../api';
import {fetchListSaga, fetchPersistentSaga, fetchItemSaga} from '../../../common/sagas/index';

const extraResults = [[
    {
        algo: {
            hash: '194f479d77a2c71e643fe3efefe3fb1ee371e3100912379b70ad2eea2295bca4',
            name: 'toto',
            storageAddress: 'http://127.0.0.1:8001/algo/194f479d77a2c71e643fe3efefe3fb1ee371e3100912379b70ad2eea2295bca4/file',
        },
        challenge: {
            hash: 'd5002e1cd50bd5de5341df8a7b7d11b6437154b3b08f531c9b8f93889855c66f',
            metrics: {
                hash: '750f622262854341bd44f55c1018949e9c119606ef5068bd7d137040a482a756',
                storageAddress: 'http://127.0.0.1:8001/challenge/d5002e1cd50bd5de5341df8a7b7d11b6437154b3b08f531c9b8f93889855c66f/metrics',
            },
        },
        creator: 'a3119c79a173581425cbe6e06c3034ec396ee805b60d9a34feaa3048beb0e4a9',
        endModel: {
            hash: '30060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568',
            storageAddress: 'http://127.0.0.1:8001/model/20060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568/file',
        },
        key: '1bb5c8f42315914909c764545ea44e32b04c773468c439c9eb506176670ee6b8',
        log: 'no error, ah ah ahstill no error, suprah ah ah',
        permissions: 'all',
        startModel: {
            hash: '20060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568',
            storageAddress: 'http://127.0.0.1:8001/model/10060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568/file',
        },
        status: 'done',
        testData: {
            keys: ['4b5152871b181d10ee774c10458c064c70710f4ba35938f10c0b7aa51f7dc010'],
            openerHash: 'a8b7c235abb9a93742e336bd76ff7cd8ecc49f612e5cf6ea506dc10f4fd6b6f0',
            perf: 0.60,
            worker: '2d76419f4231cf67bdc53f569201322a4822dff152351fb468db013d484fc762',
        },
        trainData: {
            keys: ['62fb3263208d62c7235a046ee1d80e25512fe782254b730a9e566276b8c0ef3a', '42303efa663015e729159833a12ffb510ff92a6e386b8152f90f6fb14ddc94c9'],
            openerHash: 'ccbaa3372bc74bce39ce3b138f558b3a7558958ef2f244576e18ed75b0cea994',
            perf: 0.50,
            worker: 'a3119c79a173581425cbe6e06c3034ec396ee805b60d9a34feaa3048beb0e4a9',
        },
    },
    {
        algo: {
            hash: '294f479d77a2c71e643fe3efefe3fb1ee371e3100912379b70ad2eea2295bca4',
            name: 'tutu',
            storageAddress: 'http://127.0.0.1:8001/algo/294f479d77a2c71e643fe3efefe3fb1ee371e3100912379b70ad2eea2295bca4/file',
        },
        challenge: {
            hash: 'd5002e1cd50bd5de5341df8a7b7d11b6437154b3b08f531c9b8f93889855c66f',
            metrics: {
                hash: '750f622262854341bd44f55c1018949e9c119606ef5068bd7d137040a482a756',
                storageAddress: 'http://127.0.0.1:8001/challenge/d5002e1cd50bd5de5341df8a7b7d11b6437154b3b08f531c9b8f93889855c66f/metrics',
            },
        },
        creator: 'a3119c79a173581425cbe6e06c3034ec396ee805b60d9a34feaa3048beb0e4a9',
        endModel: {
            hash: '40060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568',
            storageAddress: 'http://127.0.0.1:8001/model/30060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568/file',
        },
        key: '2bb5c8f42315914909c764545ea44e32b04c773468c439c9eb506176670ee6b8',
        log: 'no error, ah ah ahstill no error, suprah ah ah',
        permissions: 'all',
        startModel: {
            hash: '30060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568',
            storageAddress: 'http://127.0.0.1:8001/model/20060f1d9e450d98bb5892190860eee8dd48594f00e0e1c9374a27c5acdba568/file',
        },
        status: 'done',
        testData: {
            keys: ['4b5152871b181d10ee774c10458c064c70710f4ba35938f10c0b7aa51f7dc010'],
            openerHash: 'a8b7c235abb9a93742e336bd76ff7cd8ecc49f612e5cf6ea506dc10f4fd6b6f0',
            perf: 0.70,
            worker: 'a3119c79a173581425cbe6e06c3034ec396ee805b60d9a34feaa3048beb0e4a9',
        },
        trainData: {
            keys: ['62fb3263208d62c7235a046ee1d80e25512fe782254b730a9e566276b8c0ef3a', '42303efa663015e729159833a12ffb510ff92a6e386b8152f90f6fb14ddc94c9'],
            openerHash: 'ccbaa3372bc74bce39ce3b138f558b3a7558958ef2f244576e18ed75b0cea994',
            perf: 0.70,
            worker: '2d76419f4231cf67bdc53f569201322a4822dff152351fb468db013d484fc762',
        },
    },
]];

function* fetchList(request) {
    const state = yield select();

    const f = () => fetchListApi(state.location.query);

    yield call(fetchListSaga(actions, f), request);

    // TODO remove, only for dev purposes
    //yield put(actions.list.success(extraResults));
}

// function* fetchDetail({payload}) {
//     const state = yield select();
//
//     if (!state.model.item.results.find(o => o.pkhash === payload)) {
//         yield put(actions.item.request({id: payload.endModel.hash, get_parameters: {}}));
//     }
// }

function* fetchItemFileSaga({payload: {url}}) {
    let status;
    let filename;

    yield fetch(url, {
        headers: {
            Accept: 'application/json;version=0.0',
        },
        mode: 'cors',
    }).then((response) => {
        status = response.status;
        if (!response.ok) {
            return response.text().then(result => Promise.reject(new Error(result)));
        }

        filename = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

        return response.blob();
    }).then((res) => {
        saveAs(res, filename);
    }, error => ({error, status}));
}


/* istanbul ignore next */
const sagas = function* sagas() {
    yield all([
        takeLatest(actionTypes.list.REQUEST, fetchList),
        // takeLatest(actionTypes.list.SELECTED, fetchDetail),
        takeLatest(actionTypes.persistent.REQUEST, fetchPersistentSaga(actions, fetchListApi)),

        takeEvery(actionTypes.item.REQUEST, fetchItemSaga(actions, fetchItemApi)),

        takeEvery(actionTypes.item.file.REQUEST, fetchItemFileSaga),
    ]);
};


export default sagas;
