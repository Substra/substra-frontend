import { useLocalStorageArrayState } from '@/hooks/useLocalStorageState';

import { ColumnT } from './CustomColumnsTypes';
import {
    isColumn,
    GENERAL_COLUMNS,
    areColumnsEqual,
} from './CustomColumnsUtils';

const migrate = (data: unknown): ColumnT[] => {
    // custom columns used to be stored as a json array of strings matching metadata names
    if (!Array.isArray(data)) {
        return [];
    }

    // migrate old data
    let oldDataFound = false;
    const migratedData = data.map((item) => {
        if (typeof item === 'string') {
            oldDataFound = true;
            return { name: item, type: 'metadata' };
        } else {
            return item;
        }
    });

    const columns = migratedData.filter(isColumn);

    if (oldDataFound) {
        return [...GENERAL_COLUMNS, ...columns];
    } else {
        return columns;
    }
};

const useCustomColumns = (): {
    columns: ColumnT[];
    setColumns: (columns: ColumnT[]) => void;
    clearColumns: () => void;
} => {
    const {
        state: columns,
        setState: setColumns,
        clearState: clearColumns,
    } = useLocalStorageArrayState<ColumnT>(
        'custom_columns',
        areColumnsEqual,
        migrate,
        GENERAL_COLUMNS
    );

    return {
        columns,
        setColumns,
        clearColumns,
    };
};

export default useCustomColumns;
