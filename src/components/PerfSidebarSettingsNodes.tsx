import { useContext } from 'react';

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
    Skeleton,
    Tag,
    TagCloseButton,
    TagLabel,
} from '@chakra-ui/react';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

import { compareNodes } from '@/modules/nodes/NodesUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

const PerfSidebarSettingsNodes = (): JSX.Element => {
    const { nodes, selectedNodeIds, setSelectedNodeIds, loading } =
        useContext(PerfBrowserContext);

    nodes.sort(compareNodes);

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

    return (
        <Box>
            <Heading size="xs" marginBottom={4}>
                Nodes
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
                        aria-label="Clear nodes"
                        variant="ghost"
                        size="xs"
                        icon={<RiCloseLine />}
                        onClick={clear}
                    />
                    <Box color="gray.200">|</Box>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Select nodes"
                            variant="ghost"
                            size="xs"
                            icon={<RiArrowDownSLine />}
                        />
                        <MenuList>
                            <MenuGroup>
                                <MenuItem onClick={addAll}>All</MenuItem>
                            </MenuGroup>
                            <MenuGroup>
                                {nodes
                                    .filter(
                                        (node) =>
                                            !selectedNodeIds.includes(node.id)
                                    )
                                    .map((node) => (
                                        <MenuItem
                                            onClick={add(node.id)}
                                            key={node.id}
                                        >
                                            {node.id}
                                        </MenuItem>
                                    ))}
                            </MenuGroup>
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
