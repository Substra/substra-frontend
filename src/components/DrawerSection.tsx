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
    Tag,
    TagLabel,
    TagRightIcon,
    Tooltip,
    VStack,
    Code,
} from '@chakra-ui/react';
import { RiArrowRightSLine, RiUserLine } from 'react-icons/ri';

import CopyIconButton from '@/features/copy/CopyIconButton';
import { capitalize, formatDate } from '@/libs/utils';
import { PermissionT } from '@/types/CommonTypes';

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
        overflow="hidden"
        _last={{ border: 'none' }}
        {...props}
    />
);

export const DrawerSectionEntry = ({
    title,
    titleStyle,
    children,
    alignItems,
    icon,
}: {
    title: string;
    titleStyle?: 'capitalize' | 'code';
    children?: React.ReactNode;
    alignItems?: 'flex-start' | 'center' | 'baseline';
    icon?: JSX.Element;
}): JSX.Element => {
    return (
        <DrawerSectionEntryWrapper alignItems={alignItems || 'center'}>
            {icon}
            {titleStyle === 'code' && <Code fontSize="xs">{title}</Code>}
            {!titleStyle && (
                <Tooltip label={capitalize(title)}>
                    <Text
                        whiteSpace="nowrap"
                        width="120px"
                        flexShrink="0"
                        overflow="hidden"
                        textOverflow="ellipsis"
                    >
                        {capitalize(title)}
                    </Text>
                </Tooltip>
            )}
            <Box flexGrow="1" overflowX="hidden">
                {children}
            </Box>
        </DrawerSectionEntryWrapper>
    );
};

export const DrawerSectionCollapsibleEntry = ({
    title,
    titleStyle,
    aboveFold,
    children,
    icon,
}: {
    title: string;
    titleStyle?: 'capitalize' | 'code';
    aboveFold?: React.ReactNode;
    children?: React.ReactNode;
    icon?: JSX.Element;
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
                alignItems="center"
                cursor="pointer"
                onClick={onToggle}
            >
                {icon}
                {titleStyle === 'code' && <Code fontSize="xs">{title}</Code>}
                {!titleStyle && (
                    <Text whiteSpace="nowrap" width="120px" flexShrink="0">
                        {capitalize(title)}
                    </Text>
                )}
                <Box flexGrow="1" overflow="hidden">
                    {aboveFold}
                </Box>
                <Icon
                    as={RiArrowRightSLine}
                    width="16px"
                    height="16px"
                    transform={isOpen ? 'rotate(90deg)' : ''}
                    alignSelf="center"
                    fill="primary.600"
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
                <Text flexGrow="1">{value}</Text>
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

export const OrganizationDrawerSectionEntry = ({
    title,
    loading,
    organization,
}: {
    title: string;
    loading?: boolean;
    organization?: string;
}) => {
    if (loading || !organization) {
        return (
            <DrawerSectionEntry title={title}>
                <Skeleton height="4" width="250px" />
            </DrawerSectionEntry>
        );
    }
    return (
        <DrawerSectionEntry title={title}>
            <Tag size="sm">
                <TagLabel>{organization}</TagLabel>
                <TagRightIcon as={RiUserLine} />
            </Tag>
        </DrawerSectionEntry>
    );
};

export const PermissionsDrawerSectionEntry = ({
    title,
    loading,
    permission,
}: {
    title?: string;
    loading?: boolean;
    permission?: PermissionT;
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
                <PermissionTag
                    permission={permission}
                    listOrganizations={true}
                />
            </Box>
        </DrawerSectionEntryWrapper>
    );
};
