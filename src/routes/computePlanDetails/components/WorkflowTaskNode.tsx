import { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';

import { Box, Text, Flex } from '@chakra-ui/react';

import { PositionedWorkflowTaskT } from '@/modules/cpWorkflow/CPWorkflowTypes';
import {
    NODE_BORDER_COLOR,
    NODE_LABEL_COLOR,
} from '@/modules/cpWorkflow/CPWorkflowUtils';

type TaskNodeProps = {
    data: PositionedWorkflowTaskT;
};

const TaskNode = ({ data }: TaskNodeProps) => {
    const handleTopMargin = 48;
    const handleElementMargin = 15;
    const handleRadius = 60;
    return (
        <>
            {/*Handles*/}
            {data.inputs.map((value, index) => (
                <Box key={value.id}>
                    <Handle
                        type="target"
                        position={Position.Left}
                        id={value.id}
                        style={{
                            borderRadius: handleRadius,
                            top: handleTopMargin + handleElementMargin * index,
                            background: NODE_LABEL_COLOR[data.status],
                            boxShadow: `0 0 0 2px white, 0 0 0 4px ${
                                NODE_LABEL_COLOR[data.status]
                            }`,
                            cursor: 'default',
                        }}
                    />
                </Box>
            ))}
            {data.outputs.map((value, index) => (
                <Box key={value.id}>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={value.id}
                        style={{
                            borderRadius: handleRadius,
                            top: handleTopMargin + handleElementMargin * index,
                            background: NODE_LABEL_COLOR[data.status],
                            boxShadow: `0 0 0 2px white, 0 0 0 4px ${
                                NODE_LABEL_COLOR[data.status]
                            }`,
                            cursor: 'default',
                        }}
                    />
                </Box>
            ))}

            <Box fontSize="12px" padding={0}>
                {/*Header*/}
                <Box
                    padding="6px"
                    backgroundColor={NODE_BORDER_COLOR[data.status]}
                    color="white"
                >
                    <Text fontWeight="bold">_</Text>
                    <Text
                        pos="absolute"
                        top="5px"
                        right="6px"
                        padding="2px 4px 2px 4px"
                        backgroundColor={NODE_LABEL_COLOR[data.status]}
                        color="white"
                        borderRadius={3}
                        fontSize={10}
                        fontWeight={500}
                        textTransform="capitalize"
                    >
                        {data.status.replace('STATUS_', '').toLowerCase()}
                    </Text>
                </Box>

                {/*Input/output labels*/}
                <Box
                    borderTop={`2px solid ${NODE_BORDER_COLOR[data.status]}`}
                    padding="6px"
                    color="darkslategray"
                >
                    <Flex display="flex" gap="6px">
                        <Box flex="50%" textAlign="left">
                            {data.inputs.map((value) => (
                                <Text margin="0 auto 0 3px" key={value.id}>
                                    {value.id}
                                </Text>
                            ))}
                        </Box>
                        <Box flex="50%" textAlign="right">
                            {data.outputs.map((value) => (
                                <Text margin="0 3px 0 auto" key={value.id}>
                                    {value.id}
                                </Text>
                            ))}
                        </Box>
                    </Flex>
                </Box>

                <Box
                    borderTop={`2px solid ${NODE_BORDER_COLOR[data.status]}`}
                    marginTop="3px"
                    padding="6px"
                    color="darkslategray"
                >
                    <Flex gap="8px">
                        <Box textAlign="left">
                            <Text margin="0 auto 0 auto">worker</Text>
                            <Text margin="0 auto 0 auto">rank</Text>
                        </Box>
                        <Box textAlign="left">
                            <Text margin="0 auto 0 auto">{data.worker}</Text>
                            <Text margin="0 auto 0 auto">{data.rank}</Text>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </>
    );
};

const MemoizedTaskNode = memo(TaskNode);
export default MemoizedTaskNode;
