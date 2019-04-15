import {groupBy, isEqual} from 'lodash';

// math functions

const sum = arr => arr.reduce((total, current) => total + current, 0);
const avg = arr => sum(arr) / arr.length;
const calc_variance = (arr) => {
    const m = avg(arr);
    return avg(arr.map(n => (n - m) ** 2));
};

function minStatus(models, tupletype) {
    const groupedModels = groupBy(models, `${tupletype}.status`);
    if (isEqual(Object.keys(groupedModels), ['undefined'])) {
        return undefined;
    }

    const statuses = ['failed', 'todo', 'doing'];
    for (const status of statuses) {
        if (groupedModels[status]) {
            return status;
        }
    }
    return 'done';
}


const calcPerf = (models, status) => {
    let average = 0,
        variance = 0;

    if (status === 'done') {
        const perfs = models.reduce((p, c) => [
            ...p,
            ...(c.testtuple && c.testtuple.dataset ? [c.testtuple.dataset.perf] : []),
        ], []);

        average = avg(perfs);
        variance = calc_variance(perfs);
    }

    return {
        average,
        variance,
    };
};

const getTesttuple = (models, testStatus) => {
    const perf = calcPerf(models, testStatus);

    return {
        testtuple: {
            status: testStatus,
            dataset: {
                perf: perf.average,
                variance: perf.variance,
            },
        },
    };
};

const bundleByTag = groups => groups.map((models) => {
        const byTags = groupBy(models, 'traintuple.tag');
        return Object.keys(byTags).reduce((groupedModels, tag) => {
            const models = byTags[tag];

            if (tag === 'undefined') {
                // these models have no tag, they shouldn't be bundled
                return [
                    ...groupedModels,
                    ...models,
                ];
            }

            const testStatus = minStatus(models, 'testtuple');

            return [...groupedModels, {
                tag,
                models,
                // fake traintuple to ensure compatibility with rest of the code
                traintuple: {
                    ...models[0].traintuple,
                    key: tag,
                    status: minStatus(models, 'traintuple'),
                },
                // add testtuple if test status
                ...(testStatus ? getTesttuple(models, testStatus) : {}),
            }];
        }, []);
    });

export default bundleByTag;
