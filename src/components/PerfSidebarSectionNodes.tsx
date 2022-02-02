import { useContext } from 'react';

import { List, ListItem, Checkbox, Text, Skeleton } from '@chakra-ui/react';

import { compareNodes } from '@/modules/nodes/NodesUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

import PerfSidebarSection from '@/components/PerfSidebarSection';

const PerfSidebarSectionNodes = (): JSX.Element => {
    const { nodes, selectedNodeIds, onNodeIdSelectionChange, loading } =
        useContext(PerfBrowserContext);
    const { getColorScheme } = usePerfBrowserColors();
    nodes.sort(compareNodes);

    return (
        <PerfSidebarSection title="Organizations">
            <List spacing="2.5">
                {loading &&
                    [...Array(3)].map((_, index) => (
                        <ListItem
                            key={index}
                            display="flex"
                            alignItems="baseline"
                        >
                            <Skeleton>
                                <Checkbox>
                                    <Text
                                        as="span"
                                        fontSize="xs"
                                        fontWeight="semibold"
                                    >
                                        Lorem ipsum dolor sit amet
                                    </Text>
                                </Checkbox>
                            </Skeleton>
                        </ListItem>
                    ))}
                {!loading &&
                    nodes.map((node) => (
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
                                colorScheme={getColorScheme({
                                    worker: node.id,
                                    computePlanKey: '',
                                })}
                            >
                                <Text
                                    as="span"
                                    fontSize="xs"
                                    fontWeight="semibold"
                                >
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
