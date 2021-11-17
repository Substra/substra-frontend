import {
    Text,
    Box,
    Collapse,
    Flex,
    Heading,
    Icon,
    Switch,
    useDisclosure,
    List,
    ListItem,
    Checkbox,
} from '@chakra-ui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';

import { NodeType } from '@/modules/nodes/NodesTypes';

import useNodeChartStyle from '@/hooks/useNodeChartStyle';

interface SectionProps {
    title: string;
    children: React.ReactNode | React.ReactNode[];
}
const Section = ({ title, children }: SectionProps): JSX.Element => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: true,
    });

    return (
        <Box borderBottom="1px solid var(--chakra-colors-gray-100)" padding="6">
            <Heading size="xxs" textTransform="uppercase">
                <Flex justifyContent="space-between" alignItems="center">
                    {title}
                    <Icon
                        as={RiArrowDropDownLine}
                        width="6"
                        height="6"
                        onClick={onToggle}
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

interface SettingsSectionProps {
    displayAverage: boolean;
    setDisplayAverage: (displayAverage: boolean) => void;
}
const SettingsSection = ({
    displayAverage,
    setDisplayAverage,
}: SettingsSectionProps): JSX.Element => {
    return (
        <Section title="Settings">
            <Heading size="xs" marginBottom={4}>
                Other
            </Heading>
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="xs">Show average</Text>
                <Switch
                    size="sm"
                    isChecked={displayAverage}
                    onChange={() => setDisplayAverage(!displayAverage)}
                />
            </Flex>
        </Section>
    );
};

interface NodesSectionProps {
    nodes: NodeType[];
    selectedNodeKeys: string[];
    onNodeKeysSelectionChange: (
        nodeId: string
    ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const NodesSection = ({
    nodes,
    selectedNodeKeys,
    onNodeKeysSelectionChange,
}: NodesSectionProps): JSX.Element => {
    const nodeChartStyle = useNodeChartStyle();
    return (
        <Section title="Nodes">
            <List spacing="2.5">
                {nodes.map((node) => (
                    <ListItem
                        key={node.id}
                        display="flex"
                        alignItems="baseline"
                    >
                        <Text
                            as="label"
                            display="inline-flex"
                            alignItems="center"
                        >
                            <Checkbox
                                id={node.id}
                                onChange={onNodeKeysSelectionChange(node.id)}
                                value={node.id}
                                isChecked={selectedNodeKeys.includes(node.id)}
                                onClick={(e) => e.stopPropagation()}
                                colorScheme={
                                    nodeChartStyle(node.id).colorScheme
                                }
                            />
                            <Text
                                as="span"
                                fontSize="xs"
                                fontWeight="semibold"
                                marginLeft="3"
                            >
                                {node.id}
                            </Text>
                        </Text>
                    </ListItem>
                ))}
            </List>
        </Section>
    );
};

interface PerfSidebarProps extends SettingsSectionProps, NodesSectionProps {}

const PerfSidebar = ({
    displayAverage,
    setDisplayAverage,
    nodes,
    selectedNodeKeys,
    onNodeKeysSelectionChange,
}: PerfSidebarProps): JSX.Element => {
    return (
        <Box flexGrow={0} flexShrink={0} width="300px" backgroundColor="white">
            <SettingsSection
                displayAverage={displayAverage}
                setDisplayAverage={setDisplayAverage}
            />
            <NodesSection
                nodes={nodes}
                selectedNodeKeys={selectedNodeKeys}
                onNodeKeysSelectionChange={onNodeKeysSelectionChange}
            />
        </Box>
    );
};
export default PerfSidebar;
