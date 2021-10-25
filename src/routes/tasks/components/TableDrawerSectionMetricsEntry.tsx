import { Link as ChakraLink } from '@chakra-ui/react';
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
        {task.test.metrics.map((metric, index) => (
            <>
                <Link
                    key={metric.key}
                    href={compilePath(PATHS.METRIC, {
                        key: metric.key,
                    })}
                >
                    <ChakraLink color="teal.500">{metric.name}</ChakraLink>
                </Link>
                {index !== task.test.metrics.length - 1 && ', '}
            </>
        ))}
    </TableDrawerSectionEntry>
);

export default TableDrawerSectionMetricsEntry;
