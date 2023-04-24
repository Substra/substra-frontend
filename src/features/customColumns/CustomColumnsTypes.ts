import { includesColumn } from './CustomColumnsUtils';

export type ColumnT = {
    name: string;
    type: 'general' | 'metadata';
};

export enum GeneralColumnName {
    status = 'Status',
    creation = 'Creation',
    dates = 'Start date / End date / Duration',
    creator = 'Creator',
}

export const GENERAL_COLUMNS: ColumnT[] = Object.values(GeneralColumnName).map(
    (name) => ({ name, type: 'general' })
);

export const isColumn = (column: unknown): column is ColumnT => {
    if (typeof column !== 'object') {
        return false;
    }

    return (
        ((column as ColumnT).type === 'metadata' &&
            typeof (column as ColumnT).name === 'string') ||
        includesColumn(GENERAL_COLUMNS, column as ColumnT)
    );
};
