import { MenuItem } from '@chakra-ui/react';
import { RiPencilLine } from 'react-icons/ri';

type UpdateNameMenuItemProps = {
    title: string;
    openUpdateNameDialog: () => void;
};
const UpdateNameMenuItem = ({
    title,
    openUpdateNameDialog,
}: UpdateNameMenuItemProps) => (
    <MenuItem icon={<RiPencilLine />} onClick={openUpdateNameDialog}>
        {title}
    </MenuItem>
);
export default UpdateNameMenuItem;
