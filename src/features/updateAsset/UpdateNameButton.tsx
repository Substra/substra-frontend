import { IconButton } from '@chakra-ui/react';
import { RiPencilLine } from 'react-icons/ri';

type UpdateNameButtonProps = {
    title: string;
    updating: boolean;
    openUpdateNameDialog: () => void;
};

const UpdateNameButton = ({
    title,
    updating,
    openUpdateNameDialog,
}: UpdateNameButtonProps) => {
    return (
        <IconButton
            aria-label={title}
            variant="ghost"
            fontSize="20px"
            color="gray.500"
            icon={<RiPencilLine />}
            isDisabled={updating}
            onClick={openUpdateNameDialog}
        />
    );
};
export default UpdateNameButton;
