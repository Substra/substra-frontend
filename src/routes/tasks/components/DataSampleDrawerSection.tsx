import {
    List,
    ListIcon,
    ListItem,
    Text,
    Link as ChakraLink,
    VStack,
    HStack,
    Badge,
} from '@chakra-ui/react';
import {
    RiArrowRightSFill,
    RiDatabase2Fill,
    RiDatabase2Line,
} from 'react-icons/ri';
import { Link } from 'wouter';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import { compilePath, PATHS } from '@/routes';

import DrawerSectionContainer from '@/components/DrawerSectionContainer';
import IconTag from '@/components/IconTag';

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
                    >
                        <ChakraLink
                            fontSize="xs"
                            lineHeight="4"
                            fontWeight="normal"
                            color="teal.500"
                            display="inline-flex"
                            alignItems="center"
                        >
                            <HStack spacing="2.5">
                                <IconTag
                                    icon={RiDatabase2Fill}
                                    backgroundColor="teal.100"
                                    fill="teal.500"
                                />
                                <span>{dataset.name}</span>
                            </HStack>
                        </ChakraLink>
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
                            <ListIcon
                                as={RiArrowRightSFill}
                                color="gray.500"
                                width="22px"
                                height="22px"
                                padding="2px"
                            />
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