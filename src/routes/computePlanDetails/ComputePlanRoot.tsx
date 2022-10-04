import { useEffect } from 'react';

import { useLocation } from 'wouter';

import useKeyFromPath from '@/hooks/useKeyFromPath';
import { compilePath, PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';

export default () => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    useEffect(() => {
        if (key) {
            setLocation(
                compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                    key,
                }),
                { replace: true }
            );
        }
    }, [key, setLocation]);

    if (!key) {
        return <NotFound />;
    }

    return null;
};
