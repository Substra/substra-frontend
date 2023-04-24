import useOrganizationsStore from '@/features/organizations/useOrganizationsStore';
import { useTableFilterCallbackRefs } from '@/features/tableFilters/useTableFilters';
import useSelection from '@/hooks/useSelection';
import { useSyncedStringArrayState } from '@/hooks/useSyncedState';

import TableFilterCheckboxes from './TableFilterCheckboxes';

const buildOrganizationTableFilter = (
    field: string,
    title: string,
    subtitle?: string
) => {
    const OrganizationTableFilter = (): JSX.Element => {
        const [
            tmpOrganizations,
            onTmpOrganizationChange,
            resetTmpOrganizations,
            setTmpOrganizations,
        ] = useSelection();
        const [activeOrganizations] = useSyncedStringArrayState(field, []);
        const { clearRef, applyRef, resetRef } =
            useTableFilterCallbackRefs(field);

        clearRef.current = (urlSearchParams) => {
            resetTmpOrganizations();
            urlSearchParams.delete(field);
        };

        applyRef.current = (urlSearchParams) => {
            if (tmpOrganizations.length > 0) {
                urlSearchParams.set(field, tmpOrganizations.join(','));
            } else {
                urlSearchParams.delete(field);
            }
        };

        resetRef.current = () => {
            setTmpOrganizations(activeOrganizations);
        };

        const { organizations } = useOrganizationsStore();

        return (
            <TableFilterCheckboxes
                title={subtitle}
                options={organizations.map((organization) => organization.id)}
                value={tmpOrganizations}
                onChange={onTmpOrganizationChange}
            />
        );
    };

    OrganizationTableFilter.filterTitle = title;
    OrganizationTableFilter.filterField = field;
    return OrganizationTableFilter;
};

export const OwnerTableFilter = buildOrganizationTableFilter('owner', 'Owner');
export const WorkerTableFilter = buildOrganizationTableFilter(
    'worker',
    'Worker'
);
export const PermissionsTableFilter = buildOrganizationTableFilter(
    'can_process',
    'Permissions',
    'Organizations which can process the assets'
);
export const LogsAccessTableFilter = buildOrganizationTableFilter(
    'can_access_logs',
    'Logs access',
    'Organizations which can see the logs of a failed task using the dataset'
);
