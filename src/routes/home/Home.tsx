import { useLocation } from 'wouter';

import useEffectOnce from '@/hooks/useEffectOnce';
import { PATHS } from '@/routes';

const Home = (): null => {
    const [, setLocation] = useLocation();

    useEffectOnce(() => {
        setLocation(PATHS.COMPUTE_PLANS, { replace: true });
    });

    return null;
};

export default Home;
