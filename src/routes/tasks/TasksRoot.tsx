import { useLocation } from 'wouter';

import useEffectOnce from '@/hooks/useEffectOnce';
import { TaskCategory, TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

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
