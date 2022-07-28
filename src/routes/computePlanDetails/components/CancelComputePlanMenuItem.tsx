import { MenuItemProps, MenuItem } from '@chakra-ui/react';

type CancelComputePlanMenuItemProps = {
    onClick: MenuItemProps['onClick'];
};
const CancelComputePlanMenuItem = ({
    onClick,
}: CancelComputePlanMenuItemProps) => (
    <MenuItem onClick={onClick}>Cancel execution</MenuItem>
);

export default CancelComputePlanMenuItem;
