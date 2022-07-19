import { useDispatch } from 'react-redux';

import type { AppDispatchT } from '@/store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useAppDispatch = () => useDispatch<AppDispatchT>();

export default useAppDispatch;
