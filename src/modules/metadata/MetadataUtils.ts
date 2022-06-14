import { v4 as uuidv4 } from 'uuid';

import { MetadataFilter, MetadataFilterWithUUID } from './MetadataTypes';

export const isMetadataFilter = (filter: unknown): filter is MetadataFilter => {
    if (typeof filter !== 'object' || !filter) {
        return false;
    }

    if (!(filter as MetadataFilter).key || !(filter as MetadataFilter).type) {
        return false;
    }
    if (
        ((filter as MetadataFilter).type === 'is' ||
            (filter as MetadataFilter).type === 'contains') &&
        !(filter as MetadataFilter).value
    ) {
        return false;
    }
    if (
        (filter as MetadataFilter).type === 'exists' &&
        (filter as MetadataFilter).value
    ) {
        return false;
    }
    return true;
};

export const addUUID = (filter: MetadataFilter) => {
    return {
        uuid: uuidv4(),
        // we're not using `...filter` so than we never include extra keys
        key: filter.key,
        type: filter.type,
        value: filter.value,
    };
};

export const removeUUID = (filter: MetadataFilterWithUUID): MetadataFilter => ({
    key: filter.key,
    type: filter.type,
    value: filter.value,
});
