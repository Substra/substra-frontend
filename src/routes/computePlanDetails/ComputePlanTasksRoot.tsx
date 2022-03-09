import { Redirect } from 'wouter';

import useKeyFromPath from '@/hooks/useKeyFromPath';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

export default () => {
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_TASKS_ROOT);

    if (!key) {
        return <NotFound />;
    }
    return (
        <Redirect
            to={compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                key,
                category: TASK_CATEGORY_SLUGS[TaskCategory.test],
            })}
        />
    );
};
