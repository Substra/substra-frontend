import { Redirect } from 'wouter';

import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

export default () => (
    <Redirect
        to={compilePath(PATHS.TASKS, {
            category: TASK_CATEGORY_SLUGS[TaskCategory.test],
        })}
    />
);
