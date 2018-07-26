export const traintuples = [
    {
        challenge: {hash: '34563735737'},
        algo: {hash: '34563735737'},
        startModel: {hash: '34563735737'},
        endModel: {hash: '34563735737'},
        status: 'done', // todo, done, training, trained, testing, failed
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'guillaume',
    },
    {
        challenge: {hash: '34563735737'},
        algo: {hash: '34563735737'},
        startModel: {hash: '34563735737'},
        endModel: {hash: '34563735737'},
        status: 'done', // todo, done, training, trained, testing, failed
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'camille',
    },
];


export const endModelsHashes = traintuples.map(o => o.endModel.hash);

export default traintuples;
