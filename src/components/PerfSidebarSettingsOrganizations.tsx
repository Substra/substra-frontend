import { useContext, useRef } from 'react';

import {
    Box,
    Flex,
    Heading,
    IconButton,
    Menu,
    MenuButton,
    MenuGroup,
    MenuItem,
    MenuList,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    useDisclosure,
    useOutsideClick,
} from '@chakra-ui/react';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsOrganizations = (): JSX.Element => {
    const {
        organizations,
        selectedOrganizationIds,
        setSelectedOrganizationIds,
        loading,
    } = useContext(PerfBrowserContext);

    const remove = (organizationId: string) => () => {
        setSelectedOrganizationIds(
            selectedOrganizationIds.filter((id) => id !== organizationId)
        );
    };

    const clear = () => {
        setSelectedOrganizationIds([]);
    };

    const add = (organizationId: string) => () => {
        if (!selectedOrganizationIds.includes(organizationId)) {
            setSelectedOrganizationIds([
                ...selectedOrganizationIds,
                organizationId,
            ]);
        }
    };

    const notSelectedOrganizations = organizations.filter(
        (organization) => !selectedOrganizationIds.includes(organization.id)
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    useOutsideClick({
        enabled: isOpen,
        ref: containerRef,
        handler: (event) => {
            if (!containerRef.current?.contains(event.target as HTMLElement)) {
                onClose();
            }
        },
    });

    return (
        <Box>
            <Heading size="xs" marginBottom={4}>
                Filters
            </Heading>
            <Box
                borderStyle="solid"
                borderWidth="1px"
                borderColor="gray.200"
                paddingX="3.5"
                paddingY="2"
                ref={containerRef}
                onClick={() => {
                    if (loading) {
                        return;
                    }
                    if (isOpen) {
                        onClose();
                    } else {
                        onOpen();
                    }
                }}
            >
                <Flex float="right" marginRight="-7px" marginTop="-4px">
                    {!!selectedOrganizationIds.length && (
                        <>
                            <IconButton
                                aria-label="Clear organizations"
                                variant="ghost"
                                size="xs"
                                icon={<RiCloseLine />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clear();
                                }}
                                isDisabled={loading}
                            />
                            <Box color="gray.200">|</Box>
                        </>
                    )}
                    <Menu
                        placement="bottom-end"
                        closeOnBlur={false}
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                    >
                        <MenuButton
                            as={IconButton}
                            aria-label="Select organizations"
                            variant="ghost"
                            size="xs"
                            icon={<RiArrowDownSLine />}
                            isDisabled={loading}
                        />
                        <MenuList maxHeight="350px" overflowY="auto">
                            {notSelectedOrganizations.length === 0 && (
                                <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="gray.500"
                                    textAlign="center"
                                >
                                    No more options
                                </Text>
                            )}
                            {notSelectedOrganizations.length > 0 && (
                                <MenuGroup
                                    title="Organizations"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    fontWeight="bold"
                                    color="gray.500"
                                >
                                    {notSelectedOrganizations.map(
                                        (organization) => (
                                            <MenuItem
                                                onClick={add(organization.id)}
                                                key={organization.id}
                                                fontSize="xs"
                                                paddingX="4"
                                                paddingY="1.5"
                                            >
                                                {organization.id}
                                            </MenuItem>
                                        )
                                    )}
                                </MenuGroup>
                            )}
                        </MenuList>
                    </Menu>
                </Flex>
                {selectedOrganizationIds.map((organizationId) => {
                    return (
                        <Tag
                            size="sm"
                            colorScheme="teal"
                            variant="solid"
                            key={organizationId}
                            marginRight="1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <TagLabel>{organizationId}</TagLabel>
                            <TagCloseButton onClick={remove(organizationId)} />
                        </Tag>
                    );
                })}
                <Box style={{ clear: 'both' }} />
            </Box>
        </Box>
    );
};

export default PerfSidebarSettingsOrganizations;
