import { ColumnT } from './CustomColumnsTypes';

export enum GeneralColumnName {
    status = 'Status',
    creation = 'Creation',
    dates = 'Start date / End date / Duration',
}

export const GENERAL_COLUMNS: ColumnT[] = Object.values(GeneralColumnName).map(
    (name) => ({ name, type: 'general' })
);

export const areColumnsEqual = (a: ColumnT, b: ColumnT): boolean =>
    a.type === b.type && a.name === b.name;

export const getColumnId = (column: ColumnT): string =>
    `${column.type}-${column.name}`;

export const includesColumn = (
    arrayOfColumns: ColumnT[],
    column: ColumnT
): boolean =>
    arrayOfColumns.find((c) => areColumnsEqual(c, column)) !== undefined;

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
