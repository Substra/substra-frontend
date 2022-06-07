import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useLocation } from 'wouter';

import useAppDispatch from './useAppDispatch';
import { DispatchWithAutoAbort } from './useDispatchWithAutoAbort';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionBuilderT = () => AsyncThunkAction<any, any, any>;

const useHandleRefresh = (
    actionBuilder: ActionBuilderT,
    dispatchWithAutoAbort?: DispatchWithAutoAbort
): (() => void) => {
    const [location, setLocation] = useLocation();
    const dispatch = useAppDispatch();
    return () => {
        setLocation(location);
        if (dispatchWithAutoAbort) {
            dispatchWithAutoAbort(actionBuilder());
        } else {
            dispatch(actionBuilder());
        }
    };
};
export default useHandleRefresh;
