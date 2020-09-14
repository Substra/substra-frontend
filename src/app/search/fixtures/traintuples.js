export const traintuples = [
    {
        objective: {hash: '34563735737'},
        algo: {hash: '34563735737'},
        in_model: {hash: '34563735737'},
        out_model: {hash: '34563735737'},
        status: 'done', // todo, done, training, trained, testing, failed, canceled
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'guillaume',
    },
    {
        objective: {hash: '34563735737'},
        algo: {hash: '34563735737'},
        in_model: {hash: '34563735737'},
        out_model: {hash: '34563735737'},
        status: 'done', // todo, done, training, trained, testing, failed, canceled
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'camille',
    },
];


export const outModelsHashes = traintuples.filter((o) => o.out_model).map((o) => o.out_model.hash);

export default traintuples;
