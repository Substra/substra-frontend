import { useEffect } from 'react';

import ComparePerfChartBuilder from './ComparePerfChartBuilder';
import styled from '@emotion/styled';
import { useRoute } from 'wouter';

import { loadComputePlansSeries } from '@/modules/series/SeriesSlice';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useSelection from '@/hooks/useSelection';

import { PATHS } from '@/routes';

import Checkbox from '@/components/Checkbox';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: white;
`;

const LeftSider = styled.div`
    border-right: 1px solid ${Colors.border};
    display: flex;
    flex-direction: column;
    width: 270px;
    padding: ${Spaces.large};
`;

const Metrics = styled.div`
    padding: ${Spaces.large};
    width: 100%;
    height: 100%;
`;

const MetricsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Title = styled.h2`
    font-weight: ${Fonts.weights.heavy};
    font-size: ${Fonts.sizes.label};
    text-transform: uppercase;
    margin: ${Spaces.medium} 0;
`;

const ListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const Item = styled.label`
    margin-left: ${Spaces.medium};
    margin-bottom: ${Spaces.small};
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Compare = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const [, params] = useRoute(PATHS.COMPARE);
    const keys = decodeURIComponent(params?.keys || '').split(',');
    useDocumentTitleEffect(
        (setDocumentTitle) =>
            setDocumentTitle(`Compare Compute Plans - ${keys.join(' - ')}`),
        []
    );

    useEffect(() => {
        setSelectedNodeKeys(nodes.map((node) => node.id));
        setSelectedComputePlanKeys(keys);
        dispatch(loadComputePlansSeries(keys));
    }, []);

    const nodes = useAppSelector((state) => state.nodes.nodes);

    const [selectedNodeKeys, onSelectionNodeKeysChange, , setSelectedNodeKeys] =
        useSelection();
    const [
        selectedComputePlanKeys,
        onSelectionComputePlanKeysChange,
        ,
        setSelectedComputePlanKeys,
    ] = useSelection();

    return (
        <Container>
            <LeftSider>
                <Title>Nodes</Title>
                <ul>
                    {nodes.map((node) => (
                        <ListItem key={node.id}>
                            <Checkbox
                                id={node.id}
                                onChange={onSelectionNodeKeysChange(node.id)}
                                value={node.id}
                                checked={selectedNodeKeys.includes(node.id)}
                            />
                            <Item htmlFor={node.id}>{node.id}</Item>
                        </ListItem>
                    ))}
                </ul>

                <Title>Compute Plans</Title>
                <ul>
                    {keys.map((key) => (
                        <ListItem key={key}>
                            <Checkbox
                                onChange={onSelectionComputePlanKeysChange(key)}
                                value={key}
                                id={key}
                                checked={selectedComputePlanKeys.includes(key)}
                            />
                            <Item htmlFor={key}>{key}</Item>
                        </ListItem>
                    ))}
                </ul>
            </LeftSider>
            <Metrics>
                <Title>Metrics</Title>
                <MetricsContainer>
                    <ComparePerfChartBuilder
                        selectedComputePlanKeys={selectedComputePlanKeys}
                        selectedNodeKeys={selectedNodeKeys}
                    />
                </MetricsContainer>
            </Metrics>
        </Container>
    );
};
export default Compare;
