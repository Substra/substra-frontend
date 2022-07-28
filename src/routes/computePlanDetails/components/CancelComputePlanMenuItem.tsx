import { MenuItemProps, MenuItem, Tooltip } from '@chakra-ui/react';

type CancelComputePlanMenuItemProps = {
    onClick: MenuItemProps['onClick'];
    isDisabled: boolean;
};
const CancelComputePlanMenuItem = ({
    onClick,
    isDisabled,
}: CancelComputePlanMenuItemProps) =>
    isDisabled ? (
        <Tooltip
            label="This compute plan cannot be canceled: either because of its state or because you don't have permission to"
            fontSize="xs"
            hasArrow
            placement="bottom-end"
            shouldWrapChildren
        >
            <MenuItem onClick={onClick} isDisabled>
                Cancel execution
            </MenuItem>
        </Tooltip>
    ) : (
        <MenuItem onClick={onClick}>Cancel execution</MenuItem>
    );

export default CancelComputePlanMenuItem;
