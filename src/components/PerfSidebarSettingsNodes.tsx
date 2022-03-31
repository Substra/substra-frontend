import { useContext, useRef } from 'react';

import {
    Box,
    Flex,
    Heading,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Tag,
    TagCloseButton,
    TagLabel,
    useDisclosure,
    useOutsideClick,
} from '@chakra-ui/react';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { isAverageNode } from '@/modules/nodes/NodesUtils';

const PerfSidebarSettingsNodes = (): JSX.Element => {
    const { nodes, selectedNodeIds, setSelectedNodeIds, loading } =
        useContext(PerfBrowserContext);

    const remove = (nodeId: string) => () => {
        setSelectedNodeIds(selectedNodeIds.filter((id) => id !== nodeId));
    };

    const clear = () => {
        setSelectedNodeIds([]);
    };

    const add = (nodeId: string) => () => {
        if (!selectedNodeIds.includes(nodeId)) {
            setSelectedNodeIds([...selectedNodeIds, nodeId]);
        }
    };

    const notSelectedAverageNodes = nodes
        .filter((node) => isAverageNode(node.id))
        .filter((node) => !selectedNodeIds.includes(node.id));

    const notSelectedNodes = nodes
        .filter((node) => !isAverageNode(node.id))
        .filter((node) => !selectedNodeIds.includes(node.id));

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
                    {!!selectedNodeIds.length && (
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
                            {notSelectedAverageNodes.length > 0 && (
                                <MenuGroup
                                    title="Aggregations"
                                    fontSize="xs"
                                    textTransform="uppercase"
                                    fontWeight="bold"
                                    color="gray.500"
                                >
                                    {notSelectedAverageNodes.map((node) => (
                                        <MenuItem
                                            onClick={add(node.id)}
                                            key={node.id}
                                            fontSize="xs"
                                            paddingX="4"
                                            paddingY="1.5"
                                        >
                                            {node.id}
                                        </MenuItem>
                                    ))}
                                </MenuGroup>
                            )}
                            {notSelectedNodes.length > 0 && (
                                <>
                                    <MenuDivider />
                                    <MenuGroup
                                        title="Organizations"
                                        fontSize="xs"
                                        textTransform="uppercase"
                                        fontWeight="bold"
                                        color="gray.500"
                                    >
                                        {notSelectedNodes.map((node) => (
                                            <MenuItem
                                                onClick={add(node.id)}
                                                key={node.id}
                                                fontSize="xs"
                                                paddingX="4"
                                                paddingY="1.5"
                                            >
                                                {node.id}
                                            </MenuItem>
                                        ))}
                                    </MenuGroup>
                                </>
                            )}
                        </MenuList>
                    </Menu>
                </Flex>
                {selectedNodeIds.map((nodeId) => {
                    return (
                        <Tag
                            size="sm"
                            colorScheme="teal"
                            variant="solid"
                            key={nodeId}
                            marginRight="1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            <TagLabel>{nodeId}</TagLabel>
                            <TagCloseButton onClick={remove(nodeId)} />
                        </Tag>
                    );
                })}
                <Box style={{ clear: 'both' }} />
            </Box>
        </Box>
    );
};

export default PerfSidebarSettingsNodes;
