import { useEffect, useState } from 'react';

import Breadcrumbs from './components/BreadCrumbs';
import PerfChartBuilder from './components/PerfChartBuilder';
import TabsNav from './components/TabsNav';
import {
    Box,
    Flex,
    Heading,
    HStack,
    Icon,
    useDisclosure,
    Collapse,
    Text,
    Switch,
    ListItem,
    List,
    Checkbox,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { RiArrowDropDownLine } from 'react-icons/ri';

import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useSelection from '@/hooks/useSelection';

import { PATHS } from '@/routes';

import { Spaces } from '@/assets/theme';

const Item = styled.label`
    margin-left: ${Spaces.medium};
    margin-bottom: ${Spaces.small};
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ComputePlanChart = (): JSX.Element => {
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);
    const { isOpen: isOpenNodes, onToggle: onToggleNodes } = useDisclosure({
        defaultIsOpen: true,
    });

    const { isOpen: isOpenOther, onToggle: onToggleOther } = useDisclosure({
        defaultIsOpen: true,
    });

    const [displayAverage, setDisplayAverage] = useState(false);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    const dispatch = useAppDispatch();
    const nodes = useAppSelector((state) => state.nodes.nodes);

    useEffect(() => {
        setSelectedNodeKeys(nodes.map((node) => node.id));
        if (key && computePlan?.key !== key) {
            dispatch(retrieveComputePlan(key));
        }
    }, [key, nodes]);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const [selectedNodeKeys, onSelectionNodeKeysChange, , setSelectedNodeKeys] =
        useSelection();

    return (
        <Flex direction="column" alignItems="stretch" flexGrow={1}>
            <Box
                background="white"
                borderBottom="1px solid var(--chakra-colors-gray-100)"
            >
                <Breadcrumbs />
                <TabsNav />
            </Box>
            <HStack height="100%">
                <Box height="100%" width="300px" backgroundColor="white">
                    <Box
                        borderBottom="1px solid var(--chakra-colors-gray-100)"
                        padding="6"
                    >
                        <Heading size="xs" textTransform="uppercase">
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                Settings
                                <Icon
                                    as={RiArrowDropDownLine}
                                    width="6"
                                    height="6"
                                    onClick={onToggleOther}
                                    transform={
                                        isOpenOther ? '' : 'rotate(-90deg)'
                                    }
                                />
                            </Flex>
                        </Heading>
                        <Collapse in={isOpenOther} animateOpacity>
                            <Box marginTop={4}>
                                <Heading size="xs" marginBottom={4}>
                                    Other
                                </Heading>
                                <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Text>Show average</Text>
                                    <Switch
                                        isChecked={displayAverage}
                                        onChange={() =>
                                            setDisplayAverage(!displayAverage)
                                        }
                                    />
                                </Flex>
                            </Box>
                        </Collapse>
                    </Box>
                    <Box padding="6">
                        <Heading size="xs" textTransform="uppercase">
                            <Flex
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                Nodes
                                <Icon
                                    as={RiArrowDropDownLine}
                                    width="6"
                                    height="6"
                                    onClick={onToggleNodes}
                                    transform={
                                        isOpenNodes ? '' : 'rotate(-90deg)'
                                    }
                                />
                            </Flex>
                        </Heading>
                        <Collapse in={isOpenNodes} animateOpacity>
                            <Box marginTop={4}>
                                <List>
                                    {nodes.map((node) => (
                                        <ListItem
                                            key={node.id}
                                            display="flex"
                                            alignItems="baseline"
                                        >
                                            <Checkbox
                                                id={node.id}
                                                onChange={onSelectionNodeKeysChange(
                                                    node.id
                                                )}
                                                value={node.id}
                                                isChecked={selectedNodeKeys.includes(
                                                    node.id
                                                )}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                            <Item htmlFor={node.id}>
                                                {node.id}
                                            </Item>
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Collapse>
                    </Box>
                </Box>
                <Flex
                    paddingLeft="8"
                    paddingRight="8"
                    paddingTop="6"
                    paddingBottom="6"
                    width="100%"
                    height="100%"
                    flexWrap="wrap"
                    flexDirection="row"
                    justifyContent="center"
                >
                    {computePlan && (
                        <PerfChartBuilder
                            computePlan={computePlan}
                            displayAverage={displayAverage}
                            selectedNodeKeys={selectedNodeKeys}
                        />
                    )}
                </Flex>
            </HStack>
        </Flex>
    );
};

export default ComputePlanChart;
