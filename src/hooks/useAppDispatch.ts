import type { AppDispatch } from '@/store';

import { useDispatch } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
