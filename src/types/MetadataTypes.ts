export type MetadataFilterT = 'contains' | 'exists' | 'is';

export type MetadataFilterPropsT = {
    key: string;
    type: MetadataFilterT;
    value?: string;
};

export type MetadataFilterWithUuidT = MetadataFilterPropsT & {
    uuid: string;
};

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
