import React from 'react';

import {
    HStack,
    Text,
    Box,
    Heading,
    useDisclosure,
    Icon,
    Collapse,
    StackProps,
    Skeleton,
} from '@chakra-ui/react';
import { VStack } from '@chakra-ui/react';
import { RiArrowRightSLine } from 'react-icons/ri';

import { capitalize, formatDate } from '@/libs/utils';
import { PermissionType } from '@/modules/common/CommonTypes';

import CopyIconButton from '@/components/CopyIconButton';
import PermissionTag from '@/components/PermissionTag';

export const DrawerSectionHeading = ({
    title,
    children,
}: {
    title: string;
    children?: React.ReactNode;
}): JSX.Element => (
    <Heading
        size="xxs"
        textTransform="uppercase"
        display="flex"
        alignItems="center"
    >
        <span>{title}</span>
        {children}
    </Heading>
);

export const DrawerSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}): JSX.Element => (
    <VStack spacing={1} alignItems="flex-start">
        <DrawerSectionHeading title={title} />
        {children}
    </VStack>
);

export const DrawerSectionEntryWrapper = (props: StackProps) => (
    <HStack
        spacing="2"
        fontSize="xs"
        borderBottom="1px solid"
        borderBottomColor="gray.100"
        paddingY="4"
        width="100%"
        _last={{ border: 'none' }}
        {...props}
    />
);

export const DrawerSectionEntry = ({
    title,
    children,
    alignItems,
}: {
    title: string;
    children?: React.ReactNode;
    alignItems?: 'flex-start' | 'center';
}): JSX.Element => {
    return (
        <DrawerSectionEntryWrapper alignItems={alignItems || 'center'}>
            <Text whiteSpace="nowrap" width="120px" flexShrink="0">
                {capitalize(title)}
            </Text>
            <Box flexGrow="1">{children}</Box>
        </DrawerSectionEntryWrapper>
    );
};

export const DrawerSectionCollapsibleEntry = ({
    title,
    aboveFold,
    children,
}: {
    title: string;
    aboveFold?: React.ReactNode;
    children?: React.ReactNode;
}): JSX.Element => {
    const { isOpen, onToggle } = useDisclosure({
        defaultIsOpen: false,
    });
    return (
        <Box
            fontSize="xs"
            borderBottom="1px solid"
            borderBottomColor="gray.100"
            paddingY="4"
            width="100%"
            _last={{ border: 'none' }}
        >
            <HStack
                spacing="2"
                alignItems="flex-start"
                cursor="pointer"
                onClick={onToggle}
            >
                <Text whiteSpace="nowrap" width="120px" flexShrink="0">
                    {capitalize(title)}
                </Text>
                <Box flexGrow="1">{aboveFold}</Box>
                <Icon
                    as={RiArrowRightSLine}
                    width="16px"
                    height="16px"
                    transform={isOpen ? 'rotate(90deg)' : ''}
                    alignSelf="center"
                    fill="teal.600"
                />
            </HStack>
            <Collapse in={isOpen} animateOpacity>
                <Box backgroundColor="gray.50" padding="4" marginTop="2.5">
                    {children}
                </Box>
            </Collapse>
        </Box>
    );
};

export const DrawerSectionKeyEntry = ({
    value,
    loading,
}: {
    value: string | undefined;
    loading?: boolean;
}): JSX.Element => (
    <DrawerSectionEntry title="Key">
        {loading || !value ? (
            <Skeleton height="4" width="250px" />
        ) : (
            <HStack spacing={1.5}>
                <Text>{value}</Text>
                <CopyIconButton
                    value={value}
                    aria-label={`Copy key`}
                    variant="solid"
                    size="xs"
                />
            </HStack>
        )}
    </DrawerSectionEntry>
);

export const DrawerSectionDateEntry = ({
    date,
    title,
    loading,
}: {
    date: string | undefined;
    title: string;
    loading?: boolean;
}): JSX.Element => (
    <DrawerSectionEntry title={capitalize(title)}>
        {loading || !date ? (
            <Skeleton height="4" width="250px" />
        ) : (
            formatDate(date)
        )}
    </DrawerSectionEntry>
);

export const DRAWER_SECTION_ENTRY_LINK_MAX_WIDTH = '325px';
export const DRAWER_SECTION_COLLAPSIBLE_ENTRY_LINK_MAX_WIDTH = '300px';

export const PermissionsDrawerSectionEntry = ({
    title,
    loading,
    permission,
}: {
    title?: string;
    loading?: boolean;
    permission?: PermissionType;
}) => {
    if (loading || !permission) {
        return (
            <DrawerSectionEntry title={title || 'Permissions'}>
                <Skeleton height="4" width="250px" />
            </DrawerSectionEntry>
        );
    }
    return (
        <DrawerSectionEntryWrapper alignItems="flex-start">
            <Text
                whiteSpace="nowrap"
                width="120px"
                flexShrink="0"
                paddingTop="2px" // compensates for the extra height of tag components
            >
                {title || 'Permissions'}
            </Text>
            <Box flexGrow="1">
                <PermissionTag permission={permission} listNodes={true} />
            </Box>
        </DrawerSectionEntryWrapper>
    );
};
