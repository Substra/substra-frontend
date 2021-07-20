import { StoreProvider } from '@/store';

import useExpandedSection from './useExpandedSection';
import { renderHook, act } from '@testing-library/react-hooks';

test('useExpandedSection has one global state', () => {
    const { result: resultA } = renderHook(() => useExpandedSection('a'), {
        wrapper: StoreProvider,
    });
    const { result: resultB } = renderHook(() => useExpandedSection('n'), {
        wrapper: StoreProvider,
    });

    // Expand section A

    act(() => {
        resultA.current[1](true);
    });

    expect(resultA.current[0]).toBeTruthy;
    expect(resultB.current[0]).toBeFalsy;

    // Expand section B

    act(() => {
        resultB.current[1](true);
    });

    expect(resultA.current[0]).toBeFalsy;
    expect(resultB.current[0]).toBeTruthy;

    // Close section B

    act(() => {
        resultB.current[1](false);
    });

    expect(resultA.current[0]).toBeFalsy;
    expect(resultB.current[0]).toBeFalsy;
});
