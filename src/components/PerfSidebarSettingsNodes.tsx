import { useContext } from 'react';

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
    Skeleton,
    Tag,
    TagCloseButton,
    TagLabel,
} from '@chakra-ui/react';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

import { isAverageNode } from '@/modules/nodes/NodesUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

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

    const addAll = () => {
        setSelectedNodeIds(nodes.map((node) => node.id));
    };

    const notSelectedAverageNodes = nodes
        .filter((node) => isAverageNode(node.id))
        .filter((node) => !selectedNodeIds.includes(node.id));

    const notSelectedNodes = nodes
        .filter((node) => !isAverageNode(node.id))
        .filter((node) => !selectedNodeIds.includes(node.id));

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
            >
                <Flex float="right" marginRight="-7px" marginTop="-4px">
                    <IconButton
                        aria-label="Clear organizations"
                        variant="ghost"
                        size="xs"
                        icon={<RiCloseLine />}
                        onClick={clear}
                    />
                    <Box color="gray.200">|</Box>
                    <Menu placement="bottom-end">
                        <MenuButton
                            as={IconButton}
                            aria-label="Select organizations"
                            variant="ghost"
                            size="xs"
                            icon={<RiArrowDownSLine />}
                        />
                        <MenuList maxHeight="350px" overflowY="auto">
                            <MenuGroup>
                                <MenuItem
                                    onClick={addAll}
                                    fontSize="xs"
                                    paddingX="4"
                                    paddingY="1.5"
                                >
                                    Select all
                                </MenuItem>
                            </MenuGroup>
                            {notSelectedAverageNodes.length > 0 && (
                                <>
                                    <MenuDivider />
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
                                </>
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
                {loading && (
                    <>
                        <Skeleton
                            height="20px"
                            width="160px"
                            marginBottom="1"
                        />
                        <Skeleton
                            height="20px"
                            width="160px"
                            marginBottom="1"
                        />
                        <Skeleton height="20px" width="130px" />
                    </>
                )}
                {!loading &&
                    selectedNodeIds.map((nodeId) => {
                        return (
                            <Tag
                                size="sm"
                                colorScheme="teal"
                                variant="solid"
                                key={nodeId}
                                marginRight="1"
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
