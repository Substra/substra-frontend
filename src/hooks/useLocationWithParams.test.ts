import useLocationWithParams from './useLocationWithParams';
import { renderHook, act } from '@testing-library/react-hooks';

test('can update only location', () => {
    const { result } = renderHook(() => useLocationWithParams());

    act(() =>
        result.current.setLocationWithParams('/foo', { search: [], page: 1 })
    );
    expect(result.current.location).toBe('/foo');
    expect(result.current.params).toStrictEqual({ search: [], page: 1 });

    act(() => result.current.setLocationWithParams('/bar'));
    expect(result.current.location).toBe('/bar');
    expect(result.current.params).toStrictEqual({ search: [], page: 1 });
});

test('can update only searchFilters', () => {
    const { result } = renderHook(() => useLocationWithParams());

    act(() =>
        result.current.setLocationWithParams('/foo', { search: [], page: 1 })
    );
    expect(result.current.location).toBe('/foo');
    expect(result.current.params).toStrictEqual({ search: [], page: 1 });

    act(() =>
        result.current.setLocationWithParams({
            search: [
                {
                    asset: 'algo',
                    key: 'key',
                    value: 'foo',
                },
            ],
        })
    );
    expect(result.current.location).toBe('/foo');
    expect(result.current.params).toStrictEqual({
        search: [
            {
                asset: 'algo',
                key: 'key',
                value: 'foo',
            },
        ],
        page: 1,
    });
});

test('can update only page', () => {
    const { result } = renderHook(() => useLocationWithParams());

    act(() =>
        result.current.setLocationWithParams('/foo', { search: [], page: 1 })
    );
    expect(result.current.location).toBe('/foo');
    expect(result.current.params).toStrictEqual({ search: [], page: 1 });

    act(() =>
        result.current.setLocationWithParams({
            page: 2,
        })
    );
    expect(result.current.location).toBe('/foo');
    expect(result.current.params).toStrictEqual({ search: [], page: 2 });
});

test('can update both location and params', () => {
    const { result } = renderHook(() => useLocationWithParams());

    act(() =>
        result.current.setLocationWithParams('/foo', { search: [], page: 1 })
    );
    expect(result.current.location).toBe('/foo');
    expect(result.current.params).toStrictEqual({ search: [], page: 1 });

    act(() =>
        result.current.setLocationWithParams('/bar', {
            search: [
                {
                    asset: 'algo',
                    key: 'key',
                    value: 'foo',
                },
            ],
            page: 2,
        })
    );
    expect(result.current.location).toBe('/bar');
    expect(result.current.params).toStrictEqual({
        search: [
            {
                asset: 'algo',
                key: 'key',
                value: 'foo',
            },
        ],
        page: 2,
    });
});