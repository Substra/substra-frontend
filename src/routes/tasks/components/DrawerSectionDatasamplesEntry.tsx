import { Skeleton, HStack, List, ListItem, Text } from '@chakra-ui/react';
import { RiDatabase2Line } from 'react-icons/ri';

import AngleIcon from '@/assets/svg/angle-icon.svg';
import { AnyFullTupleT } from '@/modules/tasks/TuplesTypes';

import {
    DrawerSectionEntry,
    DrawerSectionCollapsibleEntry,
} from '@/components/DrawerSection';
import IconTag from '@/components/IconTag';

const DrawerSectionDatasamplesEntry = ({
    loading,
    task,
    dataSampleKeys,
}: {
    loading: boolean;
    task: AnyFullTupleT | null;
    dataSampleKeys: string[] | undefined;
}): JSX.Element => {
    return (
        <>
            {(loading || !task) && <Skeleton height="4" width="250px" />}
            {!loading && task && dataSampleKeys && dataSampleKeys.length === 1 && (
                <DrawerSectionEntry title="Datasample">
                    <HStack spacing="2.5">
                        <IconTag
                            icon={RiDatabase2Line}
                            backgroundColor="gray.100"
                            fill="gray.500"
                        />
                        <Text as="span" fontSize="xs" lineHeight="4">
                            {dataSampleKeys[0]}
                        </Text>
                    </HStack>
                </DrawerSectionEntry>
            )}
            {!loading && task && dataSampleKeys && dataSampleKeys.length > 1 && (
                <DrawerSectionCollapsibleEntry
                    title="Datasamples"
                    aboveFold={
                        <Text color="gray.500">
                            {dataSampleKeys.length} data samples
                        </Text>
                    }
                >
                    <List spacing={2.5}>
                        {dataSampleKeys.map((dataSampleKey) => (
                            <ListItem key={dataSampleKey}>
                                <HStack spacing="2.5">
                                    <AngleIcon />
                                    <IconTag
                                        icon={RiDatabase2Line}
                                        backgroundColor="gray.100"
                                        fill="gray.500"
                                    />
                                    <Text
                                        as="span"
                                        fontSize="xs"
                                        lineHeight="4"
                                    >
                                        {dataSampleKey}
                                    </Text>
                                </HStack>
                            </ListItem>
                        ))}
                    </List>
                </DrawerSectionCollapsibleEntry>
            )}
        </>
    );
};

export default DrawerSectionDatasamplesEntry;
