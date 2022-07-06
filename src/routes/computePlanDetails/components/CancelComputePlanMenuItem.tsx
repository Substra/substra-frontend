import { MenuItemProps, MenuItem } from '@chakra-ui/react';
import { RiStopLine } from 'react-icons/ri';

type CancelComputePlanMenuItemProps = {
    onClick: MenuItemProps['onClick'];
};
const CancelComputePlanMenuItem = ({
    onClick,
}: CancelComputePlanMenuItemProps) => (
    <MenuItem icon={<RiStopLine />} color="red" onClick={onClick}>
        Cancel execution
    </MenuItem>
);

export default CancelComputePlanMenuItem;
