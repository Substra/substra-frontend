export type MetadataFilterT = 'contains' | 'exists' | 'is';

export type MetadataFilterPropsT = {
    key: string;
    type: MetadataFilterT;
    value?: string;
};

export type MetadataFilterWithUuidT = MetadataFilterPropsT & {
    uuid: string;
};
