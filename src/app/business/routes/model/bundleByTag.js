import {groupBy, uniqBy} from 'lodash';

// math functions

const sum = arr => arr.reduce((total, current) => total + current, 0);
const avg = arr => sum(arr) / arr.length;
const calc_variance = (arr) => {
    const m = avg(arr);
    return avg(arr.map(n => (n - m) ** 2));
};

function minStatus(models, getStatus) {
    const statuses = ['failed', 'todo', 'doing', 'done'];
    const modelStatuses = uniqBy(models.map(m => getStatus(m)));
    for (const status of statuses) {
        if (modelStatuses.includes(status)) {
            return status;
        }
    }
    return undefined;
}

const minTraintupleStatus = models => minStatus(models, model => model.traintuple.status);
const minTesttupleStatus = models => minStatus(models, model => model.testtuple && model.testtuple.status);
const minNonCertifiedTesttupleStatus = nonCertifiedTesttuples => minStatus(nonCertifiedTesttuples, t => t.status);


const calcPerf = (testtuples, status) => {
    let average = 0,
        variance = 0;

    if (status === 'done') {
        const perfs = testtuples.reduce((p, t) => [
            ...p,
            ...(t && t.dataset ? [t.dataset.perf] : []),
        ], []);

        average = avg(perfs);
        variance = calc_variance(perfs);
    }

    return {
        average,
        variance,
    };
};

const getFakeTraintuple = (models, tag) => ({
    traintuple: {
        key: tag,
        status: minTraintupleStatus(models),
    },
});

const buildTesttuple = (name, testtuples, status) => {
    if (!status) {
        return {};
    }

    const perf = calcPerf(testtuples, status);

    return {
        [name]: {
            status,
            dataset: {
                perf: perf.average,
                variance: perf.variance,
            },
        },
    };
};

const getFakeTesttuple = (models) => {
    const status = minTesttupleStatus(models);
    return buildTesttuple('testtuple', models.map(m => m.testtuple), status);
};

const getFakeNonCertifiedTesttuple = (models) => {
    const nonCertifiedTesttuples = models.reduce((t, m) => [
            ...t,
            ...(m && m.nonCertifiedTesttuples ? m.nonCertifiedTesttuples : []),
        ], []);
    const status = minNonCertifiedTesttupleStatus(nonCertifiedTesttuples);
    return buildTesttuple('nonCertifiedTesttuple', nonCertifiedTesttuples, status);
};

const bundleByTag = (groups, modelsDetailsByKey) => groups.map((models) => {
        const byTags = groupBy(models, 'traintuple.tag');
        return Object.keys(byTags).reduce((groupedModels, tag) => {
            const models = byTags[tag];

            if (tag === 'undefined' || tag === '') {
                // these models have no tag, they shouldn't be bundled
                return [
                    ...groupedModels,
                    ...models,
                ];
            }

            // add details to models and compute average non certified testtuple
            const modelsWithDetails = models
                .map(m => modelsDetailsByKey[m.traintuple.key] || m)
                .map(m => ({...m, ...getFakeNonCertifiedTesttuple([m])}));

            return [...groupedModels, {
                tag,
                models: modelsWithDetails,
                ...getFakeTraintuple(models, tag),
                ...getFakeTesttuple(models),
                ...getFakeNonCertifiedTesttuple(modelsWithDetails),
            }];
        }, []);
    });

export default bundleByTag;
