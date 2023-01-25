import useSelection from '@/hooks/useSelection';
import { useStatus } from '@/hooks/useSyncedState';
import { useTableFilterCallbackRefs } from '@/hooks/useTableFilters';
import { getStatusLabel, getStatusDescription } from '@/libs/status';
import { TaskStatus } from '@/types/TasksTypes';

import TableFilterCheckboxes from './TableFilterCheckboxes';

const TaskStatusTableFilter = (): JSX.Element => {
    const [tmpStatus, onTmpStatusChange, resetTmpStatus, setTmpStatus] =
        useSelection();

    const [activeStatus] = useStatus();
    const { clearRef, applyRef, resetRef } =
        useTableFilterCallbackRefs('status');

    clearRef.current = (urlSearchParams) => {
        resetTmpStatus();
        urlSearchParams.delete('status');
    };

    applyRef.current = (urlSearchParams) => {
        if (tmpStatus.length > 0) {
            urlSearchParams.set('status', tmpStatus.join(','));
        } else {
            urlSearchParams.delete('status');
        }
    };

    resetRef.current = () => {
        setTmpStatus(activeStatus);
    };

    const options = Object.values(TaskStatus).map((status) => ({
        value: status,
        label: getStatusLabel(status),
        description: getStatusDescription(status),
    }));

    return (
        <TableFilterCheckboxes
            options={options}
            value={tmpStatus}
            onChange={onTmpStatusChange}
        />
    );
};

TaskStatusTableFilter.filterTitle = 'Status';
TaskStatusTableFilter.filterField = 'status';

export default TaskStatusTableFilter;
