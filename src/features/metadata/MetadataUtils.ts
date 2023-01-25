import { v4 as uuidv4 } from 'uuid';

import {
    MetadataFilterPropsT,
    MetadataFilterWithUuidT,
} from '@/types/MetadataTypes';

export const isMetadataFilter = (
    filter: unknown
): filter is MetadataFilterPropsT => {
    if (typeof filter !== 'object' || !filter) {
        return false;
    }

    if (
        !(filter as MetadataFilterPropsT).key ||
        !(filter as MetadataFilterPropsT).type
    ) {
        return false;
    }
    if (
        ((filter as MetadataFilterPropsT).type === 'is' ||
            (filter as MetadataFilterPropsT).type === 'contains') &&
        !(filter as MetadataFilterPropsT).value
    ) {
        return false;
    }
    if (
        (filter as MetadataFilterPropsT).type === 'exists' &&
        (filter as MetadataFilterPropsT).value
    ) {
        return false;
    }
    return true;
};

export const addUUID = (filter: MetadataFilterPropsT) => {
    return {
        uuid: uuidv4(),
        // we're not using `...filter` so than we never include extra keys
        key: filter.key,
        type: filter.type,
        value: filter.value,
    };
};

export const removeUUID = (
    filter: MetadataFilterWithUuidT
): MetadataFilterPropsT => ({
    key: filter.key,
    type: filter.type,
    value: filter.value,
});
