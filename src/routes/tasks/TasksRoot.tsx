import { useEffect } from 'react';

import { useLocation } from 'wouter';

import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

export default () => {
    const [, setLocation] = useLocation();

    useEffect(() => {
        setLocation(
            compilePath(PATHS.TASKS, {
                category: TASK_CATEGORY_SLUGS[TaskCategory.test],
            }),
            { replace: true }
        );
    }, []);

    return null;
};
