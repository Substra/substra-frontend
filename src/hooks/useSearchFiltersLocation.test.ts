import { renderHook, act } from '@testing-library/react-hooks';

import useSearchFiltersLocation from './useSearchFiltersLocation';

test('can update only location', () => {
    const { result } = renderHook(() => useSearchFiltersLocation());

    act(() => result.current[2]('/foo'));
    expect(result.current[0]).toBe('/foo');
    expect(result.current[1]).toStrictEqual([]);

    act(() => result.current[2]('/bar'));
    expect(result.current[0]).toBe('/bar');
    expect(result.current[1]).toStrictEqual([]);
});

test('can update only searchFilters', () => {
    const { result } = renderHook(() => useSearchFiltersLocation());

    act(() => result.current[2]('/foo'));
    expect(result.current[0]).toBe('/foo');
    expect(result.current[1]).toStrictEqual([]);

    act(() =>
        result.current[2]([
            {
                asset: 'algo',
                key: 'key',
                value: 'foo',
            },
        ])
    );
    expect(result.current[0]).toBe('/foo');
    expect(result.current[1]).toStrictEqual([
        {
            asset: 'algo',
            key: 'key',
            value: 'foo',
        },
    ]);
});

test('can update both location and searchFilters', () => {
    const { result } = renderHook(() => useSearchFiltersLocation());

    act(() => result.current[2]('/foo'));
    expect(result.current[0]).toBe('/foo');
    expect(result.current[1]).toStrictEqual([]);

    act(() =>
        result.current[2]('/bar', [
            {
                asset: 'algo',
                key: 'key',
                value: 'foo',
            },
        ])
    );
    expect(result.current[0]).toBe('/bar');
    expect(result.current[1]).toStrictEqual([
        {
            asset: 'algo',
            key: 'key',
            value: 'foo',
        },
    ]);
});
