import { useEffect } from 'react';

import { useLocation } from 'wouter';

import { PATHS } from '@/routes';

const Home = (): null => {
    const [, setLocation] = useLocation();

    useEffect(() => {
        setLocation(PATHS.COMPUTE_PLANS, { replace: true });
    }, []);

    return null;
};

export default Home;
