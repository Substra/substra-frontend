import { BreadcrumbItem, Text } from '@chakra-ui/react';
import { RiDatabase2Line } from 'react-icons/ri';

import { PATHS } from '@/paths';

import Breadcrumbs from '@/components/Breadcrumbs';

import useDatasetStore from '../useDatasetStore';

const DatasetBreadcrumbs = (): JSX.Element => {
    const { dataset, fetchingDataset } = useDatasetStore();
    return (
        <Breadcrumbs
            rootPath={PATHS.DATASETS}
            rootLabel="Datasets"
            rootIcon={RiDatabase2Line}
        >
            <BreadcrumbItem isCurrentPage={true}>
                <Text
                    color="black"
                    fontSize="sm"
                    fontWeight="medium"
                    lineHeight="5"
                >
                    {fetchingDataset && 'Loading'}
                    {!fetchingDataset && dataset && <>{dataset.name}</>}
                </Text>
            </BreadcrumbItem>
        </Breadcrumbs>
    );
};

export default DatasetBreadcrumbs;
