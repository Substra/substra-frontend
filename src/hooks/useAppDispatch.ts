import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/store';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;
