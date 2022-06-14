export type MetadataFilterType = 'contains' | 'exists' | 'is';

export type MetadataFilter = {
    key: string;
    type: MetadataFilterType;
    value?: string;
};

export type MetadataFilterWithUUID = MetadataFilter & {
    uuid: string;
};
