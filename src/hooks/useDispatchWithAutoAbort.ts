import { useCallback, useRef } from 'react';

import { AsyncThunkAction } from '@reduxjs/toolkit';

import useAppDispatch from './useAppDispatch';

type DispatchWithAutoAbort = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: AsyncThunkAction<any, any, any>
) => () => void;

const useDispatchWithAutoAbort = (): DispatchWithAutoAbort => {
    const dispatch = useAppDispatch();
    const promiseRef = useRef<{ abort: () => void } | null>(null);

    const dispatchWithAutoAbort = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (action: AsyncThunkAction<any, any, any>) => {
            if (promiseRef.current) {
                promiseRef.current.abort();
            }
            promiseRef.current = dispatch(action);
            return () => {
                if (promiseRef.current) {
                    promiseRef.current.abort();
                }
            };
        },
        [dispatch, promiseRef]
    );
    return dispatchWithAutoAbort;
};
export default useDispatchWithAutoAbort;
