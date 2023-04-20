import { MenuItemProps, MenuItem, Tooltip } from '@chakra-ui/react';

type CancelComputePlanMenuItemProps = {
    onClick: MenuItemProps['onClick'];
    hasPermissions: boolean;
    hasCancellableStatus: boolean;
};
const CancelComputePlanMenuItem = ({
    onClick,
    hasPermissions,
    hasCancellableStatus,
}: CancelComputePlanMenuItemProps) => {
    const isDisabled = !hasPermissions || !hasCancellableStatus;
    let label;

    if (!isDisabled) {
        return <MenuItem onClick={onClick}>Cancel execution</MenuItem>;
    } else if (hasPermissions) {
        label = 'This compute plan cannot be canceled because of its state';
    } else {
        label =
            "This compute plan cannot be canceled because you don't have permission to";
    }
    return (
        <Tooltip
            label={label}
            fontSize="xs"
            hasArrow
            placement="bottom-end"
            shouldWrapChildren
        >
            <MenuItem onClick={onClick} isDisabled>
                Cancel execution
            </MenuItem>
        </Tooltip>
    );
};

export default CancelComputePlanMenuItem;
