import { useLocalStorageStringArrayState } from '@/hooks/useLocalStorageState';

const useCustomColumns = (): {
    columns: string[];
    setColumns: (columns: string[]) => void;
    clearColumns: () => void;
} => {
    const {
        state: columns,
        setState: setColumns,
        clearState: clearColumns,
    } = useLocalStorageStringArrayState('custom_columns');

    return {
        columns,
        setColumns,
        clearColumns,
    };
};

export default useCustomColumns;
