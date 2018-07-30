import createDeepEqualSelector from '../../utils/selector';

const location = state => state.location;
const item = state => state.search.item;

const challengeResults = state => state.challenge.persistent.results;
const datasetResults = state => state.dataset.persistent.results;
const algoResults = state => state.algo.persistent.results;
const modelResults = state => state.model.persistent.results;

export const endModelsHashes = createDeepEqualSelector([modelResults],
    modelResults => modelResults.map(o => ({hash: `hash:${o.endModel.hash}`})),
);

export const getFilters = createDeepEqualSelector([location, challengeResults, datasetResults, algoResults, endModelsHashes],
    (location, challenge, dataset, algo, endModelsHashes) => ({
        challenge,
        dataset,
        algo,
        model: endModelsHashes, // output model i.e trained model (updated)
        ...(location.type === 'MODEL' ? {
            model_parents: endModelsHashes,
            model_children: endModelsHashes,
            model_family: endModelsHashes,
        } : {}),
    }),
);

export const getParentSuggestions = createDeepEqualSelector([getFilters],
    filters => Object.keys(filters).map(o => ({label: o})),
);

export const getIsInParentMode = createDeepEqualSelector([getFilters, item],
    (filters, item) => Object.keys(filters).includes(item),
);

const getKey = (key) => {
    const arr = key.split('_');

    return `key:${arr[1]}`;
};

export const getSuggestions = createDeepEqualSelector([getFilters, item, getParentSuggestions, getIsInParentMode],
    (filters, item, parentSuggestions, isInParentMode) => {
        if (isInParentMode) {
            return filters[item].reduce((p, c) => [
                    ...p,
                    ...(c.name ? [{label: `name:${c.name}`}] : []),
                    ...(c.key ? [{label: getKey(c.key)}] : []),
                    ...(c.hash ? [{label: c.hash}] : []),

                    // add metrics name if exists for challenge
                    ...(c.metrics && c.metrics.name ? [{label: `metrics:${c.metrics.name}`}] : []),
                    ...(c.owner ? [{label: `owner:${c.owner}`}] : []),

                    // add type for dataset
                    ...(c.type ? [{label: `type:${c.type}`}] : []),
                ],
                []);
        }

        return parentSuggestions;
    },
);


export default {
    getSuggestions,
    getParentSuggestions,
    getFilters,
    getIsInParentMode,
};
