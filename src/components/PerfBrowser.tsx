import { useContext } from 'react';

import { Flex, HStack } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

import PerfDetails from '@/components/PerfDetails';
import PerfList from '@/components/PerfList';
import PerfLoadingState from '@/components/PerfLoadingState';
import PerfSidebarSettings from '@/components/PerfSidebarSettings';

type PerfBrowserProps = {
    SidebarComponent: React.FunctionComponent;
};

const PerfBrowser = ({ SidebarComponent }: PerfBrowserProps) => {
    const {
        loading,
        selectedMetricName,
        setSelectedMetricName,
        xAxisMode,
        seriesGroups,
        seriesGroupsWithRounds,
        selectedSeriesGroup,
        drawerTestTaskKey,
        setDrawerTestTaskKey,
    } = useContext(PerfBrowserContext);

    return (
        <>
            <TaskDrawer
                category={TaskCategory.test}
                taskKey={drawerTestTaskKey}
                onClose={() => setDrawerTestTaskKey(null)}
                setPageTitle={false}
            />
            <HStack
                flexGrow={1}
                spacing="0"
                alignItems="stretch"
                overflow="hidden"
                alignSelf="stretch"
            >
                <Flex
                    flexGrow={0}
                    flexShrink={0}
                    flexDirection="column"
                    width="350px"
                    backgroundColor="white"
                    overflowX="hidden"
                    overflowY="auto"
                >
                    <PerfSidebarSettings />
                    <SidebarComponent />
                </Flex>
                <Flex
                    flexGrow={1}
                    flexWrap="wrap"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    overflowX="hidden"
                    overflowY="auto"
                >
                    {loading && <PerfLoadingState />}
                    {!loading && (
                        <>
                            {selectedMetricName && (
                                <PerfDetails series={selectedSeriesGroup} />
                            )}
                            {!selectedMetricName && (
                                <PerfList
                                    seriesGroups={
                                        xAxisMode === 'round'
                                            ? seriesGroupsWithRounds
                                            : seriesGroups
                                    }
                                    onCardClick={(metricName) =>
                                        setSelectedMetricName(metricName)
                                    }
                                />
                            )}
                        </>
                    )}
                </Flex>
            </HStack>
        </>
    );
};

export default PerfBrowser;
