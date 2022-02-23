import { useRef } from 'react';

import useAppDispatch from './useAppDispatch';
import { AsyncThunkAction } from '@reduxjs/toolkit';

type DispatchWithAutoAbort = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: AsyncThunkAction<any, any, any>
) => () => void;

const useDispatchWithAutoAbort = (): DispatchWithAutoAbort => {
    const dispatch = useAppDispatch();
    const promiseRef = useRef<{ abort: () => void } | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (action: AsyncThunkAction<any, any, any>) => {
        if (promiseRef.current) {
            promiseRef.current.abort();
        }
        promiseRef.current = dispatch(action);
        return () => {
            if (promiseRef.current) {
                promiseRef.current.abort();
            }
        };
    };
};
export default useDispatchWithAutoAbort;
