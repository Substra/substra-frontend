import { AsyncThunkAction } from '@reduxjs/toolkit';

import useAppDispatch from './useAppDispatch';
import { DispatchWithAutoAbortProps } from './useDispatchWithAutoAbort';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionBuilderT = () => AsyncThunkAction<any, any, any>;

const useHandleRefresh = (
    actionBuilder: ActionBuilderT,
    dispatchWithAutoAbort?: DispatchWithAutoAbortProps
): (() => void) => {
    const dispatch = useAppDispatch();

    return () => {
        if (dispatchWithAutoAbort) {
            dispatchWithAutoAbort(actionBuilder());
        } else {
            dispatch(actionBuilder());
        }
    };
};
export default useHandleRefresh;
