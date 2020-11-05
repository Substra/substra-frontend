export const traintuples = [
    {
        objective: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        algo: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        in_model: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        out_model: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        status: 'done', // todo, done, training, trained, testing, failed, canceled
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'guillaume',
    },
    {
        objective: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        algo: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        in_model: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        out_model: {key: '51d906cc-10b2-9eb8-1c93-5550b7508119'},
        status: 'done', // todo, done, training, trained, testing, failed, canceled
        rank: 0,
        perf: 0.99,
        permissions: 'all',
        creator: 'camille',
    },
];


export const outModelsKeys = traintuples.filter((o) => o.out_model).map((o) => o.out_model.key);

export default traintuples;
