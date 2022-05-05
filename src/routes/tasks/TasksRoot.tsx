import { useLocation } from 'wouter';

import useEffectOnce from '@/hooks/useEffectOnce';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

export default () => {
    const [, setLocation] = useLocation();

    useEffectOnce(() => {
        setLocation(
            compilePath(PATHS.TASKS, {
                category: TASK_CATEGORY_SLUGS[TaskCategory.test],
            }),
            { replace: true }
        );
    });

    return null;
};
