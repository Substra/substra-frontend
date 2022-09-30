export const PATHS = {
    HOME: '/',
    LOGIN: '/login',
    COMPARE: '/compare/:keys',
    COMPUTE_PLANS: '/compute_plans',
    COMPUTE_PLAN: '/compute_plans/:key',
    COMPUTE_PLAN_CHART: '/compute_plans/:key/chart',
    COMPUTE_PLAN_TASKS: '/compute_plans/:key/tasks',
    COMPUTE_PLAN_TASK: '/compute_plans/:key/tasks/:taskKey',
    COMPUTE_PLAN_WORKFLOW: '/compute_plans/:key/workflow',
    DATASETS: '/datasets',
    DATASET: '/datasets/:key',
    ALGOS: '/algorithms',
    ALGO: '/algorithms/:key',
    SETTINGS: '/settings',
    TASKS: '/tasks',
    TASK: '/tasks/:key',
    USERS: '/users',
    USER: '/users/:key',
    RESET_PASSWORD: '/reset_password/:key',
};

export function compilePath(
    path: string,
    params: { [key: string]: string }
): string {
    let compiledPath = path;
    let paramName, paramValue;
    for ([paramName, paramValue] of Object.entries(params)) {
        compiledPath = compiledPath.replace(
            `:${paramName}`,
            encodeURIComponent(paramValue)
        );
    }
    return compiledPath;
}
