import { useEffect } from 'react';

import { useLocation } from 'wouter';

import useKeyFromPath from '@/hooks/useKeyFromPath';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

export default () => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN);

    useEffect(() => {
        if (key) {
            setLocation(
                compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                    key,
                    category: TASK_CATEGORY_SLUGS[TaskCategory.test],
                }),
                { replace: true }
            );
        }
    }, [key]);

    if (!key) {
        return <NotFound />;
    }

    return null;
};
