import { useLocalStorageStringItems } from '@/hooks/useLocalStorageItems';

const useCustomColumns = (): {
    columns: string[];
    setColumns: (columns: string[]) => void;
    clearColumns: () => void;
} => {
    const {
        items: columns,
        setItems: setColumns,
        clearItems: clearColumns,
    } = useLocalStorageStringItems('custom_columns');

    return {
        columns,
        setColumns,
        clearColumns,
    };
};

export default useCustomColumns;
