import {
    Box,
    Collapse,
    Flex,
    Heading,
    Icon,
    useDisclosure,
} from '@chakra-ui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface PerfSidebarSectionProps {
    title: string;
    children: React.ReactNode | React.ReactNode[];
}
const PerfSidebarSection = ({
    title,
    children,
}: PerfSidebarSectionProps): JSX.Element => {
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
                    {title}
                    <Icon
                        as={RiArrowDropDownLine}
                        width="6"
                        height="6"
                        transform={isOpen ? '' : 'rotate(-90deg)'}
                    />
                </Flex>
            </Heading>
            <Collapse in={isOpen} animateOpacity>
                <Box marginTop={4}>{children}</Box>
            </Collapse>
        </Box>
    );
};

export default PerfSidebarSection;
