import {
    Box,
    List,
    ListItem,
    Text,
    Link,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react';
import { RiDatabase2Fill, RiDatabase2Line } from 'react-icons/ri';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import { compilePath, PATHS } from '@/routes';

import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import IconTag from '@/components/IconTag';

import AngleIcon from '@/assets/svg/angle-icon.svg';

interface DataSampleDrawerSection {
    dataset: DatasetStubType;
    dataSampleKeys: string[];
}

const DataSampleDrawerSection = ({
    dataset,
    dataSampleKeys,
}: DataSampleDrawerSection): JSX.Element => {
    return (
        <DrawerSectionContainer title="Data samples">
            <VStack spacing="2.5" alignItems="flex-start">
                <HStack spacing="1.5">
                    <Link
                        href={compilePath(PATHS.DATASET, { key: dataset.key })}
                        fontSize="xs"
                        lineHeight="4"
                        fontWeight="normal"
                        color="teal.500"
                        display="inline-flex"
                        alignItems="center"
                        isExternal
                    >
                        <HStack spacing="2.5">
                            <IconTag
                                icon={RiDatabase2Fill}
                                backgroundColor="teal.100"
                                fill="teal.500"
                            />
                            <span>{dataset.name}</span>
                        </HStack>
                    </Link>
                    <Badge
                        variant="solid"
                        color="gray.500"
                        backgroundColor="gray.50"
                        fontSize="xs"
                    >
                        {dataSampleKeys.length}
                    </Badge>
                </HStack>
                <List spacing={2.5}>
                    {dataSampleKeys.map((dataSampleKey) => (
                        <ListItem display="flex" key={dataSampleKey}>
                            <Box margin="3px 16px 0px 8px">
                                <AngleIcon />
                            </Box>
                            <HStack spacing="2.5">
                                <IconTag
                                    icon={RiDatabase2Line}
                                    backgroundColor="gray.100"
                                    fill="gray.500"
                                />
                                <Text as="span" fontSize="xs" lineHeight="4">
                                    {dataSampleKey}
                                </Text>
                            </HStack>
                        </ListItem>
                    ))}
                </List>
            </VStack>
        </DrawerSectionContainer>
    );
};
export default DataSampleDrawerSection;
