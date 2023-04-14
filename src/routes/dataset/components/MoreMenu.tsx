import { Box, Menu, MenuButton, IconButton, MenuList } from '@chakra-ui/react';
import { RiMoreLine } from 'react-icons/ri';

type MoreMenuProps = {
    children: React.ReactNode;
};
const MoreMenu = ({ children }: MoreMenuProps) => (
    <Box>
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<RiMoreLine />}
                variant="outline"
                size="xs"
            />
            <MenuList>{children}</MenuList>
        </Menu>
    </Box>
);

export default MoreMenu;
