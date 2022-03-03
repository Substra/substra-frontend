import { useContext, useMemo } from 'react';

import { List, ListItem, Checkbox, Text, Skeleton } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import {
    NodeListItem,
    PerfSidebarContainer,
    SerieListItem,
} from '@/components/PerfSidebarCommon';

const NodeList = ({ computePlanKey }: { computePlanKey: string }) => {
    const { nodes: allNodes, selectedNodeIds } = useContext(PerfBrowserContext);
    const nodes = useMemo(
        () => allNodes.filter((node) => selectedNodeIds.includes(node.id)),
        [allNodes, selectedNodeIds]
    );
    return (
        <PerfSidebarContainer title="Lines">
            <List>
                {nodes.map((node) => (
                    <NodeListItem
                        key={node.id}
                        nodeId={node.id}
                        computePlanKey={computePlanKey}
                    />
                ))}
            </List>
        </PerfSidebarContainer>
    );
};

const SerieList = () => {
    const { rankData: allRankData, selectedNodeIds } =
        useContext(PerfBrowserContext);
    const rankData = useMemo(
        () =>
            allRankData.filter((serieRankData) =>
                selectedNodeIds.includes(serieRankData.worker)
            ),
        [allRankData, selectedNodeIds]
    );
    return (
        <PerfSidebarContainer title="Lines">
            <List marginX="-20px">
                {rankData.map((serieRankData) => (
                    <SerieListItem
                        serieRankData={serieRankData}
                        key={serieRankData.id}
                    />
                ))}
            </List>
        </PerfSidebarContainer>
    );
};

const PerfSidebarLines = (): JSX.Element => {
    const { computePlans, loading, selectedMetricName } =
        useContext(PerfBrowserContext);

    const computePlanKey = computePlans.length > 0 ? computePlans[0].key : '';

    if (loading) {
        return (
            <PerfSidebarContainer title="Lines">
                <List spacing="2.5">
                    {[...Array(3)].map((_, index) => (
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
                </List>
            </PerfSidebarContainer>
        );
    }

    if (!selectedMetricName) {
        return <NodeList computePlanKey={computePlanKey} />;
    }

    return <SerieList />;
};

export default PerfSidebarLines;
