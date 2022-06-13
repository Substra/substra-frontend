import {
    Box,
    Collapse,
    Flex,
    Heading,
    Icon,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';

import PerfSidebarSettingsOrganizations from '@/components/PerfSidebarSettingsOrganizations';
import PerfSidebarSettingsUnits from '@/components/PerfSidebarSettingsUnits';

const PerfSidebarSettings = (): JSX.Element => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    return (
        <Box borderBottom="1px solid var(--chakra-colors-gray-100)" padding="6">
            <Heading size="xxs" textTransform="uppercase" cursor="pointer">
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={onToggle}
                >
                    Settings
                    <Icon
                        as={RiArrowDropDownLine}
                        width="6"
                        height="6"
                        transform={isOpen ? '' : 'rotate(-90deg)'}
                    />
                </Flex>
            </Heading>
            <Collapse in={isOpen} animateOpacity>
                <VStack marginTop={4} spacing={4} alignItems="stretch">
                    <PerfSidebarSettingsOrganizations />
                    <PerfSidebarSettingsUnits />
                </VStack>
            </Collapse>
        </Box>
    );
};

export default PerfSidebarSettings;
