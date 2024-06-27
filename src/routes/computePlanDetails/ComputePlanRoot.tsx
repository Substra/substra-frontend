import { useEffect } from 'react';

import { useLocation, useParams } from 'wouter';

import { compilePath, PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';

export default () => {
    const [, setLocation] = useLocation();
    const { key } = useParams();

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
