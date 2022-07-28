import { AsyncThunkAction } from '@reduxjs/toolkit';
import { useLocation } from 'wouter';

import useAppDispatch from './useAppDispatch';
import { DispatchWithAutoAbortProps } from './useDispatchWithAutoAbort';
import { useSetLocationPreserveParams } from './useLocationWithParams';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionBuilderT = () => AsyncThunkAction<any, any, any>;

const useHandleRefresh = (
    actionBuilder: ActionBuilderT,
    dispatchWithAutoAbort?: DispatchWithAutoAbortProps
): (() => void) => {
    const [location] = useLocation();
    const setLocationPreserveParams = useSetLocationPreserveParams();
    const dispatch = useAppDispatch();

    return () => {
        setLocationPreserveParams(location);
        if (dispatchWithAutoAbort) {
            dispatchWithAutoAbort(actionBuilder());
        } else {
            dispatch(actionBuilder());
        }
    };
};
export default useHandleRefresh;
