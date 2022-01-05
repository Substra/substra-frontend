import { Link, List, ListItem, Text } from '@chakra-ui/react';

import { Testtuple } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { TableDrawerSectionEntry } from '@/components/TableDrawerSection';

const TableDrawerSectionMetricsEntry = ({
    task,
}: {
    task: Testtuple;
}): JSX.Element => (
    <TableDrawerSectionEntry title="Metrics">
        <List>
            {task.test.metrics.map((metric) => (
                <ListItem key={metric.key}>
                    <Text
                        maxWidth="370px"
                        isTruncated
                        textAlign="right"
                        marginLeft="auto"
                    >
                        <Link
                            href={compilePath(PATHS.METRIC, {
                                key: metric.key,
                            })}
                            color="teal.500"
                            isExternal
                        >
                            {metric.name}
                        </Link>
                    </Text>
                </ListItem>
            ))}
        </List>
    </TableDrawerSectionEntry>
);

export default TableDrawerSectionMetricsEntry;
