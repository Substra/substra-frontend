import { useContext } from 'react';

import { List, ListItem, Checkbox, Text } from '@chakra-ui/react';

import useNodeChartStyle from '@/hooks/useNodeChartStyle';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfSidebarSection from '@/components/PerfSidebarSection';

const PerfSidebarSectionNodes = (): JSX.Element => {
    const { nodes, selectedNodeIds, onNodeIdSelectionChange } =
        useContext(PerfBrowserContext);
    const nodeChartStyle = useNodeChartStyle();
    return (
        <PerfSidebarSection title="Nodes">
            <List spacing="2.5">
                {nodes.map((node) => (
                    <ListItem
                        key={node.id}
                        display="flex"
                        alignItems="baseline"
                    >
                        <Checkbox
                            id={node.id}
                            onChange={onNodeIdSelectionChange(node.id)}
                            value={node.id}
                            isChecked={selectedNodeIds.includes(node.id)}
                            onClick={(e) => e.stopPropagation()}
                            colorScheme={nodeChartStyle(node.id).colorScheme}
                        >
                            <Text as="span" fontSize="xs" fontWeight="semibold">
                                {node.id}
                            </Text>
                        </Checkbox>
                    </ListItem>
                ))}
            </List>
        </PerfSidebarSection>
    );
};

export default PerfSidebarSectionNodes;
