import createDeepEqualSelector from '../../utils/selector';

const location = state => state.location;
const item = state => state.search.item;
const filters = state => state.search.filters;

const objectiveResults = state => state.objective.persistent.results;
const datasetResults = state => state.dataset.persistent.results;
const algoResults = state => state.algo.persistent.results;
const modelResults = state => state.model.persistent.results;

export const outModelsHashes = createDeepEqualSelector([modelResults],
    modelResults => modelResults.length ? modelResults[0].filter(o => o.traintuple.outModel).map(o => ({hash: `hash:${o.traintuple.outModel.hash}`})) : modelResults,
);

export const getSearchFilters = createDeepEqualSelector([location, objectiveResults, datasetResults, algoResults, outModelsHashes],
    (location, objective, dataset, algo, outModelsHashes) => ({
        objective: objective.length ? objective[0] : objective,
        dataset: dataset.length ? dataset[0] : dataset,
        algo: algo.length ? algo[0] : algo,
        model: outModelsHashes, // output model i.e trained model (updated)
        ...(location.type === 'MODEL' ? {
            model_parents: outModelsHashes,
            model_children: outModelsHashes,
            model_family: outModelsHashes,
        } : {}),
    }),
);

export const getParentSuggestions = createDeepEqualSelector([filters, item, getSearchFilters],
    (filters, item, searchFilters) => [
            ...(Object.keys(filters).length && item !== '-OR-' ? [{label: '-OR-', isLogic: true}] : []),
            ...Object.keys(searchFilters).map(o => ({label: o})),
        ]);

export const getIsInParentMode = createDeepEqualSelector([getSearchFilters, item],
    (searchFilters, item) => Object.keys(searchFilters).includes(item),
);

export const getSuggestions = createDeepEqualSelector([getSearchFilters, item, getParentSuggestions, getIsInParentMode],
    (searchFilters, item, parentSuggestions, isInParentMode) => {
        if (isInParentMode) {
            return searchFilters[item].reduce((p, c) => [
                    ...p,
                    ...(c.name ? [{label: `name:${c.name}`, uuid: `${c.key}_name`}] : []),
                    ...(c.key ? [{label: `key:${c.key}`, uuid: `${c.key}_key`}] : []),
                    ...(c.hash ? [{label: c.hash, uuid: `${c.hash}_hash`}] : []),

                    // add metrics name if exists for objective
                    ...(c.metrics && c.metrics.name ? [{
                        label: `metrics:${c.metrics.name}`,
                        uuid: `${c.key}_metrics`,
                    }] : []),
                    ...(c.owner ? [{label: `owner:${c.owner}`, uuid: `${c.key}_owner`}] : []),

                    // add type for dataset
                    ...(c.type ? [{label: `type:${c.type}`, uuid: `${c.key}_type`}] : []),
                ],
                []);
        }

        return parentSuggestions;
    },
);


export default {
    getSuggestions,
    getParentSuggestions,
    getSearchFilters,
    getIsInParentMode,
};
