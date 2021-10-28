import { Link as ChakraLink, List, ListItem } from '@chakra-ui/react';
import { Link } from 'wouter';

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
                <ListItem>
                    <Link
                        key={metric.key}
                        href={compilePath(PATHS.METRIC, {
                            key: metric.key,
                        })}
                    >
                        <ChakraLink color="teal.500">{metric.name}</ChakraLink>
                    </Link>
                </ListItem>
            ))}
        </List>
    </TableDrawerSectionEntry>
);

export default TableDrawerSectionMetricsEntry;
