export const traintuples = [
    {
        challenge: {hash: '34563735737'},
        algo: {hash: '34563735737'},
        inModel: {hash: '34563735737'},
        outModel: {hash: '34563735737'},
        status: 'done', // todo, done, training, trained, testing, failed
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'guillaume',
    },
    {
        challenge: {hash: '34563735737'},
        algo: {hash: '34563735737'},
        inModel: {hash: '34563735737'},
        outModel: {hash: '34563735737'},
        status: 'done', // todo, done, training, trained, testing, failed
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'camille',
    },
];


export const outModelsHashes = traintuples.filter(o => o.outModel).map(o => o.outModel.hash);

export default traintuples;
