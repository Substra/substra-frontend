import { useState, useEffect } from 'react';

import { useSyncedDateStringState } from '@/hooks/useSyncedState';
import { useTableFilterCallbackRefs } from '@/hooks/useTableFilters';

import TableFilterDate, { TableFilterDateProps } from './TableFilterDate';

const defaultFilterDateMode: TableFilterDateProps['mode'] = 'after';

const buildDateTableFilter = (field: string, title: string) => {
    const DateTableFilter = (): JSX.Element => {
        const [tmpMinDate, setTmpMinDate] = useState<string>('');
        const [tmpMaxDate, setTmpMaxDate] = useState<string>('');
        const [tmpMode, setTmpMode] = useState<TableFilterDateProps['mode']>(
            defaultFilterDateMode
        );

        const [activeMinDate] = useSyncedDateStringState(`${field}_after`, '');
        const [activeMaxDate] = useSyncedDateStringState(`${field}_before`, '');

        const { clearRef, applyRef, resetRef } =
            useTableFilterCallbackRefs(field);

        clearRef.current = (urlSearchParams) => {
            setTmpMinDate('');
            setTmpMaxDate('');
            urlSearchParams.delete(`${field}_after`);
            urlSearchParams.delete(`${field}_before`);
        };

        applyRef.current = (urlSearchParams) => {
            if (
                tmpMinDate &&
                tmpMode &&
                ['after', 'between'].includes(tmpMode)
            ) {
                urlSearchParams.set(`${field}_after`, tmpMinDate);
            } else {
                urlSearchParams.delete(`${field}_after`);
            }
            if (
                tmpMaxDate &&
                tmpMode &&
                ['before', 'between'].includes(tmpMode)
            ) {
                urlSearchParams.set(`${field}_before`, tmpMaxDate);
            } else {
                urlSearchParams.delete(`${field}_before`);
            }
        };

        resetRef.current = () => {
            setTmpMinDate(activeMinDate);
            setTmpMaxDate(activeMaxDate);
        };

        useEffect(() => {
            setTmpMinDate(activeMinDate);
            setTmpMaxDate(activeMaxDate);

            setTmpMode(() => {
                if (activeMinDate && activeMaxDate) {
                    return 'between';
                } else if (activeMinDate) {
                    return 'after';
                } else if (activeMaxDate) {
                    return 'before';
                }
                return defaultFilterDateMode;
            });
        }, [activeMinDate, activeMaxDate]);

        return (
            <TableFilterDate
                minDate={tmpMinDate}
                setMinDate={setTmpMinDate}
                maxDate={tmpMaxDate}
                setMaxDate={setTmpMaxDate}
                mode={tmpMode}
                setMode={setTmpMode}
            />
        );
    };
    DateTableFilter.filterTitle = title;
    DateTableFilter.filterField = field;
    return DateTableFilter;
};

export const CreationDateTableFilter = buildDateTableFilter(
    'creation_date',
    'Creation date'
);

export const StartDateTableFilter = buildDateTableFilter(
    'start_date',
    'Start date'
);

export const EndDateTableFilter = buildDateTableFilter('end_date', 'End date');
