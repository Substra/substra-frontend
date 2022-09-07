import { Skeleton, HStack, Text, Link } from '@chakra-ui/react';

import { DatasetStubT } from '@/modules/datasets/DatasetsTypes';
import { AnyFullTupleT } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

import DownloadIconButton from '@/components/DownloadIconButton';
import { DrawerSectionEntry } from '@/components/DrawerSection';

const DrawerSectionOpenerEntry = ({
    loading,
    task,
    dataset,
}: {
    loading: boolean;
    task: AnyFullTupleT | null;
    dataset: DatasetStubT | undefined;
}): JSX.Element => {
    return (
        <DrawerSectionEntry title="Opener">
            {loading || !task ? (
                <Skeleton height="4" width="250px" />
            ) : (
                dataset && (
                    <HStack spacing="2.5" onClick={(e) => e.stopPropagation()}>
                        <Text noOfLines={1}>
                            <Link
                                href={compilePath(PATHS.DATASET, {
                                    key: dataset.key,
                                })}
                                color="primary.500"
                                fontWeight="semibold"
                                isExternal
                            >
                                {dataset.name}
                            </Link>
                        </Text>
                        <DownloadIconButton
                            storageAddress={dataset.opener.storage_address}
                            filename={`opener-${dataset.key}.py`}
                            aria-label="Download opener"
                            size="xs"
                            placement="top"
                        />
                    </HStack>
                )
            )}
        </DrawerSectionEntry>
    );
};

export default DrawerSectionOpenerEntry;
