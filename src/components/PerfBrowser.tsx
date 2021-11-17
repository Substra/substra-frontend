import { useEffect, useMemo, useState } from 'react';

import { Flex, HStack, Text, Wrap, WrapItem } from '@chakra-ui/react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { listNodes } from '@/modules/nodes/NodesSlice';
import { SerieT } from '@/modules/series/SeriesTypes';
import { buildSeriesGroups } from '@/modules/series/SeriesUtils';

import { useAppDispatch, useAppSelector } from '@/hooks';
import useSelection from '@/hooks/useSelection';

import LoadingState from '@/components/LoadingState';
import PerfCard from '@/components/PerfCard';
import PerfChart from '@/components/PerfChart';
import PerfDetails from '@/components/PerfDetails';
import PerfSidebar from '@/components/PerfSidebar';

interface PerfBrowserProps {
    series: SerieT[];
    loading: boolean;
    computePlan: ComputePlanT | null;
}

const PerfBrowser = ({ loading, series, computePlan }: PerfBrowserProps) => {
    const [displayAverage, setDisplayAverage] = useState(false);
    const [selectedNodeKeys, onNodeKeysSelectionChange, , setSelectedNodeKeys] =
        useSelection();
    const nodes = useAppSelector((state) => state.nodes.nodes);
    const [selectedMetricName, setSelectedMetricName] = useState('');

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (nodes.length) {
            setSelectedNodeKeys(nodes.map((node) => node.id));
        } else {
            dispatch(listNodes());
        }
    }, [nodes.length]);

    const seriesGroups: SerieT[][] = useMemo(() => {
        const filteredSeries = series.filter((serie) =>
            selectedNodeKeys.includes(serie.worker)
        );
        return buildSeriesGroups(filteredSeries);
    }, [series, selectedNodeKeys]); // TODO: these deps seem wrong (references to lists of complex objects)

    const selectedSeriesGroup = useMemo(() => {
        if (!selectedMetricName) {
            return [];
        }

        const groupsMatchingMetric = seriesGroups.filter(
            (series) => series[0].metricName === selectedMetricName
        );

        if (groupsMatchingMetric.length > 0) {
            return groupsMatchingMetric[0];
        } else {
            return [];
        }
    }, [seriesGroups, selectedMetricName]);

    return (
        <HStack flexGrow={1} spacing="0" alignItems="stretch" overflow="hidden">
            <PerfSidebar
                displayAverage={displayAverage}
                setDisplayAverage={setDisplayAverage}
                nodes={nodes}
                selectedNodeKeys={selectedNodeKeys}
                onNodeKeysSelectionChange={onNodeKeysSelectionChange}
            />
            <Flex
                flexGrow={1}
                flexWrap="wrap"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                overflowX="hidden"
                overflowY="auto"
            >
                {loading && <LoadingState message="Loading performance data" />}
                {!loading && (
                    <>
                        {series.length === 0 && (
                            <Text padding="8">
                                There is no data to display: there are no test
                                tasks in status done.
                            </Text>
                        )}
                        {seriesGroups.length === 0 && (
                            <Text padding="8">
                                Select at least one node to display the data
                            </Text>
                        )}
                        {selectedMetricName && (
                            <PerfDetails
                                metricName={selectedMetricName}
                                onBack={() => setSelectedMetricName('')}
                                series={selectedSeriesGroup}
                                computePlan={computePlan}
                                displayAverage={displayAverage}
                            />
                        )}
                        {!selectedMetricName && (
                            <Wrap padding="8">
                                {seriesGroups.map((series) => (
                                    <WrapItem key={series[0].id}>
                                        <PerfCard
                                            title={series[0].metricName}
                                            onClick={() =>
                                                setSelectedMetricName(
                                                    series[0].metricName
                                                )
                                            }
                                        >
                                            <PerfChart
                                                series={series}
                                                displayAverage={displayAverage}
                                                interactive={false}
                                            />
                                        </PerfCard>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        )}
                    </>
                )}
            </Flex>
        </HStack>
    );
};

export default PerfBrowser;
