import jest from 'jest-mock';
import { renderHook } from '@testing-library/react-hooks';

import useSearchFiltersEffect from './useSearchFiltersEffect';
import { EffectCallback } from 'react';

test('triggers effect when non searchFilter deps update', () => {
    const dummyEffect = jest.fn();
    const { rerender } = renderHook(
        ({ dummyDeps }) =>
            useSearchFiltersEffect(dummyEffect as EffectCallback, dummyDeps),
        {
            initialProps: {
                dummyDeps: [
                    'foo',
                    [
                        {
                            asset: 'algo',
                            key: 'key',
                            value: 'foo',
                        },
                    ],
                ],
            },
        }
    );
    expect(dummyEffect).toBeCalledTimes(1);

    rerender({
        dummyDeps: [
            'bar',
            [
                {
                    asset: 'algo',
                    key: 'key',
                    value: 'foo',
                },
            ],
        ],
    });
    expect(dummyEffect).toBeCalledTimes(2);
});

test("doesn't trigger effect when the searchFilters set is empty", () => {
    const dummyEffect = jest.fn();
    const { rerender } = renderHook(
        ({ dummySF }) =>
            useSearchFiltersEffect(dummyEffect as EffectCallback, [dummySF]),
        { initialProps: { dummySF: [] } }
    );
    expect(dummyEffect).toBeCalledTimes(1);

    rerender({ dummySF: [] });
    expect(dummyEffect).toBeCalledTimes(1);
});

test("doesn't trigger effect when the searchFilters set is the same", () => {
    const dummyEffect = jest.fn();
    const { rerender } = renderHook(
        ({ dummySF }) =>
            useSearchFiltersEffect(dummyEffect as EffectCallback, [dummySF]),
        {
            initialProps: {
                dummySF: [
                    {
                        asset: 'algo',
                        key: 'key',
                        value: 'foo',
                    },
                    {
                        asset: 'algo',
                        key: 'key',
                        value: 'bar',
                    },
                ],
            },
        }
    );
    expect(dummyEffect).toBeCalledTimes(1);

    rerender({
        dummySF: [
            {
                asset: 'algo',
                key: 'key',
                value: 'bar',
            },
            {
                asset: 'algo',
                key: 'key',
                value: 'foo',
            },
        ],
    });
    expect(dummyEffect).toBeCalledTimes(1);

    rerender({
        dummySF: [
            {
                value: 'bar',
                asset: 'algo',
                key: 'key',
            },
            {
                value: 'foo',
                asset: 'algo',
                key: 'key',
            },
        ],
    });
    expect(dummyEffect).toBeCalledTimes(1);
});

test('triggers effect when searchFilters change', () => {
    const dummyEffect = jest.fn();
    const { rerender } = renderHook(
        ({ dummySF }) =>
            useSearchFiltersEffect(dummyEffect as EffectCallback, [dummySF]),
        {
            initialProps: {
                dummySF: [
                    {
                        asset: 'algo',
                        key: 'key',
                        value: 'foo',
                    },
                ],
            },
        }
    );
    expect(dummyEffect).toBeCalledTimes(1);

    rerender({
        dummySF: [
            {
                asset: 'algo',
                key: 'key',
                value: 'bar',
            },
        ],
    });
    expect(dummyEffect).toBeCalledTimes(2);
});
