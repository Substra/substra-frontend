import { v4 as uuidv4 } from 'uuid';

import {
    MetadataFilterPropsT,
    MetadataFilterWithUuidT,
} from '@/types/MetadataTypes';

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
