import {groupBy, uniqBy} from 'lodash';
import {deepGet} from '../../../utils/selector';

// math functions

const sum = (arr) => arr.reduce((total, current) => total + current, 0);
const avg = (arr) => sum(arr) / arr.length;
const calcVariance = (arr) => {
    const m = avg(arr);
    return avg(arr.map((n) => (n - m) ** 2));
};
const calcStandardDeviation = (arr) => Math.sqrt(calcVariance(arr));

function minStatus(models, getStatus) {
    const statuses = ['failed', 'canceled', 'waiting', 'todo', 'doing', 'done'];
    const modelStatuses = uniqBy(models.map((m) => getStatus(m)));
    for (const status of statuses) {
        if (modelStatuses.includes(status)) {
            return status;
        }
    }
    return undefined;
}

const minTraintupleStatus = (models) => minStatus(models, (model) => model.traintuple.status);
const minTesttupleStatus = (models) => minStatus(models, (model) => model.testtuple && model.testtuple.status);
const minNonCertifiedTesttupleStatus = (nonCertifiedTesttuples) => minStatus(nonCertifiedTesttuples, (t) => t.status);


const calcPerf = (testtuples, status) => {
    let average = 0,
        standardDeviation;

    if (status === 'done') {
        const perfs = testtuples.reduce((p, t) => [
            ...p,
            ...(t && t.dataset ? [t.dataset.perf] : []),
        ], []);

        average = avg(perfs);
        if (perfs.length > 1) {
            standardDeviation = calcStandardDeviation(perfs);
        }
    }

    return {
        average,
        standardDeviation,
    };
};

const getFakeTraintuple = (models) => ({
    traintuple: {
        key: models[0].traintuple.key,
        status: minTraintupleStatus(models),
        algo: models[0].traintuple.algo,
        objective: models[0].traintuple.objective,
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
                standardDeviation: perf.standardDeviation,
            },
        },
    };
};

const getFakeTesttuple = (models) => {
    const status = minTesttupleStatus(models);
    return buildTesttuple('testtuple', models.map((m) => m.testtuple), status);
};

const getFakeNonCertifiedTesttuple = (models) => {
    const nonCertifiedTesttuples = models.reduce((t, m) => [
            ...t,
            ...(m && m.nonCertifiedTesttuples ? m.nonCertifiedTesttuples : []),
        ], []);
    const status = minNonCertifiedTesttupleStatus(nonCertifiedTesttuples);
    return buildTesttuple('nonCertifiedTesttuple', nonCertifiedTesttuples, status);
};

const bundleByObjective = (tag, models, modelsDetailsByKey) => {
    const byObjective = groupBy(models, deepGet('traintuple.objective.hash'));

    return Object.keys(byObjective).reduce((groupedModels, objectiveKey) => {
        const models = byObjective[objectiveKey];

        // add details to models and compute average non certified testtuple
        const modelsWithDetails = models.map((m) => {
            const model = modelsDetailsByKey[m.traintuple.key] || m;
            return {
                ...model,
                ...getFakeNonCertifiedTesttuple([model]),
            };
        });

        return [
            ...groupedModels,
            {
                tag,
                models: modelsWithDetails,
                ...getFakeTraintuple(models),
                ...getFakeTesttuple(models),
                ...getFakeNonCertifiedTesttuple(modelsWithDetails),
            },
        ];
    }, []);
};

const bundleByAlgo = (tag, models, modelsDetailsByKey) => {
    const byAlgo = groupBy(models, deepGet('traintuple.algo.hash'));

    return Object.keys(byAlgo).reduce((groupedModels, algoKey) => {
        const models = byAlgo[algoKey];

        return [
            ...groupedModels,
            ...bundleByObjective(tag, models, modelsDetailsByKey),
        ];
    }, []);
};

const bundleByTag = (groups, modelsDetailsByKey) => groups.map((models) => {
    const byTags = groupBy(models, deepGet('traintuple.tag'));
    return Object.keys(byTags).reduce((groupedModels, tag) => {
        const tagModels = byTags[tag];

        if (tag === 'null' || tag === 'undefined' || tag === '') {
            // these models have no tag, they shouldn't be bundled
            return [
                ...groupedModels,
                ...tagModels,
            ];
        }

        return [
            ...groupedModels,
            ...bundleByAlgo(tag, tagModels, modelsDetailsByKey),
        ];
    }, []);
});

export default bundleByTag;
