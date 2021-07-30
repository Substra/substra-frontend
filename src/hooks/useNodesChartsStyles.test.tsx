import { StoreProviderProps } from '@/store';

import useNodesChartsStyles from './useNodesChartStyles';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import nodesSlice from '@/modules/nodes/NodesSlice';
import { NodeType } from '@/modules/nodes/NodesTypes';

const StoreProviderBuilder = (nodes: NodeType[]) => {
    const store = configureStore({
        reducer: {
            nodes: nodesSlice,
        },
        preloadedState: {
            nodes: { nodes },
        },
    });

    const StoreProvider = ({ children }: StoreProviderProps): JSX.Element => (
        <Provider store={store} children={children} />
    );

    return StoreProvider;
};

test('styles do not depend on the order of nodes in store', () => {
    const { result: resultA } = renderHook(() => useNodesChartsStyles(), {
        wrapper: StoreProviderBuilder([
            { id: 'node-A', is_current: false },
            { id: 'node-B', is_current: false },
        ]),
    });
    const { result: resultB } = renderHook(() => useNodesChartsStyles(), {
        wrapper: StoreProviderBuilder([
            { id: 'node-B', is_current: false },
            { id: 'node-A', is_current: false },
        ]),
    });
    expect(resultA.current['node-A']).toStrictEqual(resultB.current['node-A']);
    expect(resultA.current['node-B']).toStrictEqual(resultB.current['node-B']);
});

test('same node always has same styles', () => {
    const wrapper = StoreProviderBuilder([
        { id: 'node-B', is_current: false },
        { id: 'node-A', is_current: false },
    ]);
    const { result, rerender } = renderHook(() => useNodesChartsStyles(), {
        wrapper,
    });

    const initialStyles = { ...result.current };
    rerender();
    expect(initialStyles).toStrictEqual(result.current);
});
