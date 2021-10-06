import { useEffect } from 'react';

import { useLocation } from 'wouter';

import { PATHS } from '@/routes';

const ComputePlan = (): null => {
    const [, setLocation] = useLocation();

    useEffect(() => {
        setLocation(PATHS.COMPUTE_PLANS, { replace: true });
    }, []);

    return null;
};

export default ComputePlan;
