import ComputePlanSider from './components/ComputePlansSider';
import { VStack, Table, Thead, Tr, Th, Tbody, Td, Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useLocation } from 'wouter';

import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSelection from '@/hooks/useSelection';

import { compilePath, PATHS } from '@/routes';

import Checkbox from '@/components/Checkbox';
import {
    CreationDateSkeletonTd,
    CreationDateTd,
} from '@/components/CreationDateTableCells';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';
import StatusTableFilter from '@/components/StatusTableFilter';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
import TablePagination from '@/components/TablePagination';
import TableTitle from '@/components/TableTitle';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const SelectionContainer = styled.div`
    display: inline-block;
    font-size: ${Fonts.sizes.smallBody};
`;

const SelectionLabel = styled.span`
    font-style: italic;
`;

const ClearSelectionButton = styled.button`
    padding: ${Spaces.extraSmall} ${Spaces.small};
    margin: 0 ${Spaces.extraSmall};
    color: ${Colors.primary};
    cursor: pointer;
    text-decoration: underline;

    &:disabled {
        color: ${Colors.veryLightContent};
        cursor: not-allowed;
    }
`;

const CompareSelectionButton = styled.button`
    padding: ${Spaces.extraSmall} ${Spaces.small};
    background: ${Colors.primary};
    color: white;
    cursor: pointer;
    border-radius: 4px;

    &:disabled {
        background-color: ${Colors.primaryDisabled};
        cursor: not-allowed;
    }
`;

const ComputePlans = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();
    const [, setLocation] = useLocation();

    useSearchFiltersEffect(() => {
        dispatch(listComputePlans({ filters: searchFilters, page }));
    }, [searchFilters, page]);

    const computePlans: ComputePlanT[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const computePlansLoading = useAppSelector(
        (state) => state.computePlans.computePlansLoading
    );

    const computePlansCount = useAppSelector(
        (state) => state.computePlans.computePlansCount
    );

    const key = useKeyFromPath(PATHS.COMPUTE_PLANS_DETAILS);

    useAssetListDocumentTitleEffect('Compute plans list', key);

    const [selectedKeys, onSelectionChange, resetSelection] = useSelection();

    const onClear = () => {
        resetSelection();
    };

    const onCompare = () => {
        setLocation(
            compilePath(PATHS.COMPARE, { keys: selectedKeys.join(',') })
        );
    };

    return (
        <Box padding="6" marginLeft="auto" marginRight="auto">
            <ComputePlanSider />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Compute plans" />
                <SearchBar asset="compute_plan" />
                <SelectionContainer>
                    <SelectionLabel>
                        {selectedKeys.length === 1
                            ? '1 selected compute plan'
                            : `${selectedKeys.length} selected compute plans`}
                    </SelectionLabel>
                    <ClearSelectionButton
                        onClick={onClear}
                        disabled={selectedKeys.length === 0}
                    >
                        Clear
                    </ClearSelectionButton>
                    <CompareSelectionButton
                        onClick={onCompare}
                        disabled={selectedKeys.length < 2}
                    >
                        Compare
                    </CompareSelectionButton>
                </SelectionContainer>
                <Box
                    backgroundColor="white"
                    borderRadius="lg"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="gray.100"
                >
                    <Table size="sm">
                        <Thead>
                            <Tr>
                                <Th>&nbsp;</Th>
                                <Th>Creation date</Th>
                                <Th>Tag</Th>
                                <Th>
                                    Status
                                    <StatusTableFilter asset="compute_plan" />
                                </Th>
                                <Th>Tasks</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {!computePlansLoading &&
                                computePlans.length === 0 && (
                                    <EmptyTr nbColumns={5} />
                                )}
                            {computePlansLoading ? (
                                <TableSkeleton
                                    itemCount={computePlansCount}
                                    currentPage={page}
                                >
                                    <Td>
                                        <Skeleton width={16} height={16} />
                                    </Td>
                                    <CreationDateSkeletonTd />
                                    <Td>
                                        <Skeleton width={150} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={150} height={12} />
                                    </Td>
                                    <Td>
                                        <Skeleton width={300} height={12} />
                                    </Td>
                                </TableSkeleton>
                            ) : (
                                computePlans.map((computePlan) => (
                                    <ClickableTr
                                        key={computePlan.key}
                                        onClick={() =>
                                            setLocationWithParams(
                                                compilePath(
                                                    PATHS.COMPUTE_PLANS_DETAILS,
                                                    {
                                                        key: computePlan.key,
                                                    }
                                                )
                                            )
                                        }
                                    >
                                        <Td>
                                            <Checkbox
                                                value={computePlan.key}
                                                checked={selectedKeys.includes(
                                                    computePlan.key
                                                )}
                                                onChange={onSelectionChange(
                                                    computePlan.key
                                                )}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        </Td>
                                        <CreationDateTd
                                            creationDate={
                                                computePlan.creation_date
                                            }
                                        />
                                        <Td>{computePlan.tag}</Td>
                                        <Td>
                                            <Status
                                                status={computePlan.status}
                                            />
                                        </Td>
                                        <Td>
                                            {computePlan.done_count}/
                                            {computePlan.task_count}
                                        </Td>
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
                <TablePagination
                    currentPage={page}
                    itemCount={computePlansCount}
                />
            </VStack>
        </Box>
    );
};

export default ComputePlans;
