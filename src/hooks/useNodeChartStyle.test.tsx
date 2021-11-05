import { StoreProviderProps } from '@/store';

import useNodeChartStyle from './useNodeChartStyle';
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
            nodes: {
                nodes,
                nodesLoading: false,
                nodesError: '',

                info: {
                    host: '',
                    node_id: '',
                    config: {},
                },
                infoLoading: false,
                infoError: '',
            },
        },
    });

    const StoreProvider = ({ children }: StoreProviderProps): JSX.Element => (
        <Provider store={store} children={children} />
    );

    return StoreProvider;
};

test('styles do not depend on the order of nodes in store', () => {
    const { result: resultA } = renderHook(() => useNodeChartStyle(), {
        wrapper: StoreProviderBuilder([
            { id: 'node-A', is_current: false },
            { id: 'node-B', is_current: false },
        ]),
    });
    const { result: resultB } = renderHook(() => useNodeChartStyle(), {
        wrapper: StoreProviderBuilder([
            { id: 'node-B', is_current: false },
            { id: 'node-A', is_current: false },
        ]),
    });
    expect(resultA.current('node-A')).toStrictEqual(resultB.current('node-A'));
    expect(resultA.current('node-B')).toStrictEqual(resultB.current('node-B'));
});

test('same node always has same styles', () => {
    const wrapper = StoreProviderBuilder([
        { id: 'node-B', is_current: false },
        { id: 'node-A', is_current: false },
    ]);
    const { result, rerender } = renderHook(() => useNodeChartStyle(), {
        wrapper,
    });

    const initialStyleGetter = result.current;
    rerender();
    expect(initialStyleGetter('node-A')).toStrictEqual(
        result.current('node-A')
    );
    expect(initialStyleGetter('node-B')).toStrictEqual(
        result.current('node-B')
    );
});

test('provide default style for unknown nodes', () => {
    const wrapper = StoreProviderBuilder([]);
    const { result } = renderHook(() => useNodeChartStyle(), {
        wrapper,
    });

    expect(result.current('unknown')).toBeDefined();
    expect(result.current('unknown').color).toBeTruthy();
    expect(result.current('unknown').pointStyle).toBeTruthy();
});
