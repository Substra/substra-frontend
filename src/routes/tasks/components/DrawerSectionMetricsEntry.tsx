import { HStack, Link, List, ListItem, Text } from '@chakra-ui/react';

import { Testtuple } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/routes';

import DownloadIconButton from '@/components/DownloadIconButton';
import { DrawerSectionEntry } from '@/components/DrawerSection';

const DrawerSectionMetricsEntry = ({
    task,
}: {
    task: Testtuple;
}): JSX.Element => (
    <DrawerSectionEntry title="Metrics" alignItems="flex-start">
        <List>
            {task.test.metrics.map((metric) => (
                <ListItem key={metric.key}>
                    <HStack spacing="2.5">
                        <Text noOfLines={1}>
                            <Link
                                href={compilePath(PATHS.ALGO, {
                                    key: metric.key,
                                })}
                                color="teal.500"
                                fontWeight="semibold"
                                isExternal
                            >
                                {metric.name}
                            </Link>
                        </Text>
                        <DownloadIconButton
                            storageAddress={metric.algorithm.storage_address}
                            filename={`metric-${metric.key}.zip`}
                            aria-label="Download metric"
                            size="xs"
                            placement="top"
                        />
                    </HStack>
                </ListItem>
            ))}
        </List>
    </DrawerSectionEntry>
);

export default DrawerSectionMetricsEntry;
