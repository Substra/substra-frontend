import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootStateT } from '@/store';

const useAppSelector: TypedUseSelectorHook<RootStateT> = useSelector;

export default useAppSelector;
