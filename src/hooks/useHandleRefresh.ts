import { AsyncThunkAction } from '@reduxjs/toolkit';

import useAppDispatch from './useAppDispatch';
import { DispatchWithAutoAbort } from './useDispatchWithAutoAbort';
import { useSetLocationParams } from './useLocationWithParams';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionBuilderT = () => AsyncThunkAction<any, any, any>;

const useHandleRefresh = (
    actionBuilder: ActionBuilderT,
    dispatchWithAutoAbort?: DispatchWithAutoAbort
): (() => void) => {
    const setLocationParams = useSetLocationParams();
    const dispatch = useAppDispatch();

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.set('page', '1');
    urlSearchParams.set('ordering', '-creation_date');

    return () => {
        setLocationParams(urlSearchParams);
        if (dispatchWithAutoAbort) {
            dispatchWithAutoAbort(actionBuilder());
        } else {
            dispatch(actionBuilder());
        }
    };
};
export default useHandleRefresh;
