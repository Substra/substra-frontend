import { ColumnT } from './CustomColumnsTypes';

export const areColumnsEqual = (a: ColumnT, b: ColumnT): boolean =>
    a.type === b.type && a.name === b.name;

export const getColumnId = (column: ColumnT): string =>
    `${column.type}-${column.name}`;

export const includesColumn = (
    arrayOfColumns: ColumnT[],
    column: ColumnT
): boolean =>
    arrayOfColumns.find((c) => areColumnsEqual(c, column)) !== undefined;
