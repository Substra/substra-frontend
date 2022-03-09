import { Text } from '@chakra-ui/react';
import { RiDatabase2Line } from 'react-icons/ri';

import { useAppSelector } from '@/hooks';
import { PATHS } from '@/routes';

import Breadcrumbs from '@/components/Breadcrumbs';

const DatasetBreadcrumbs = (): JSX.Element => {
    const dataset = useAppSelector((state) => state.datasets.dataset);
    const datasetLoading = useAppSelector(
        (state) => state.datasets.datasetLoading
    );
    return (
        <Breadcrumbs
            rootPath={PATHS.DATASETS}
            rootLabel="Datasets"
            rootIcon={RiDatabase2Line}
        >
            <Text
                color="black"
                fontSize="sm"
                fontWeight="medium"
                lineHeight="5"
            >
                {datasetLoading && 'Loading'}
                {!datasetLoading && dataset && <>{dataset.name}</>}
            </Text>
        </Breadcrumbs>
    );
};

export default DatasetBreadcrumbs;
