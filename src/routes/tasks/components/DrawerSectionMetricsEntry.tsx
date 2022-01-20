import { Link, List, ListItem, Text } from '@chakra-ui/react';

import { pseudonymize } from '@/modules/nodes/NodesUtils';
import { Testtuple } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import {
    DrawerSectionEntry,
    DRAWER_SECTION_ENTRY_LINK_MAX_WIDTH,
} from '@/components/DrawerSection';

const DrawerSectionMetricsEntry = ({
    task,
}: {
    task: Testtuple;
}): JSX.Element => (
    <DrawerSectionEntry title="Metrics" alignItems="flex-start">
        <List>
            {task.test.metrics.map((metric) => (
                <ListItem key={metric.key}>
                    <Text
                        isTruncated
                        maxWidth={DRAWER_SECTION_ENTRY_LINK_MAX_WIDTH}
                    >
                        <Link
                            href={compilePath(PATHS.METRIC, {
                                key: metric.key,
                            })}
                            color="teal.500"
                            fontWeight="semibold"
                            isExternal
                        >
                            {pseudonymize(metric.name)}
                        </Link>
                    </Text>
                </ListItem>
            ))}
        </List>
    </DrawerSectionEntry>
);

export default DrawerSectionMetricsEntry;
