import createDeepEqualSelector from '../../utils/selector';

const location = state => state.location;
const item = state => state.search.item;
// TODO use persistent not filtered list
const challengeResults = state => state.challenge.list.results;
const datasetResults = state => state.dataset.list.results;
const algoResults = state => state.algo.list.results;
const modelResults = state => state.model.list.results;

export const endModelsHashes = createDeepEqualSelector([modelResults],
    modelResults => modelResults.map(o => o.endModel.hash),
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

export const getSuggestions = createDeepEqualSelector([getFilters, item, getParentSuggestions, getIsInParentMode],
    (filters, item, parentSuggestions, isInParentMode) => isInParentMode ? filters[item].map(o => ({label: o.name})) : parentSuggestions,
);


export default {
    getSuggestions,
    getParentSuggestions,
    getFilters,
    getIsInParentMode,
};
