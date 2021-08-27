import { useEffect } from 'react';

import { useLocation } from 'wouter';

import useKeyFromPath from '@/hooks/useKeyFromPath';

import { compilePath, PATHS } from '@/routes';

const ComputePlanDetails = (): null => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_DETAILS);

    useEffect(() => {
        if (key) {
            setLocation(
                compilePath(PATHS.COMPUTE_PLAN_CHART, {
                    key,
                })
            );
        }
    }, [key]);

    return null;
};

export default ComputePlanDetails;
