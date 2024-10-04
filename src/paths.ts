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
    FUNCTIONS: '/functions',
    FUNCTION: '/functions/:key',
    SETTINGS: '/settings',
    TASKS: '/tasks',
    TASK: '/tasks/:key',
    USERS: '/users',
    USER: '/users/:key',
    RESET_PASSWORD: '/reset_password/:key',
    MANAGE_TOKENS: '/manage_tokens',
};

export const API_PATHS = {
    COMPUTE_PLANS: '/compute_plan/',
    COMPUTE_PLAN: '/compute_plan/:key/',
    COMPUTE_PLAN_CANCEL: '/compute_plan/:key/cancel/',
    COMPUTE_PLAN_TASKS: '/compute_plan/:key/task/',
    COMPUTE_PLAN_PERFORMANCES: '/compute_plan/:key/perf/',
    DATASETS: '/data_manager/',
    DATASET: '/data_manager/:key/',
    FUNCTIONS: '/function/',
    FUNCTION: '/function/:key/',
    FUNCTION_PROFILING: '/function/:key/profiling',
    INFO: '/info/',
    LOGIN: '/me/login/?format=json',
    LOGOUT: '/me/logout/',
    LOGS: '/task/:key/logs/',
    METADATA: '/compute_plan_metadata/',
    NEWS_FEED: '/news_feed/',
    ORGANIZATIONS: '/organization/',
    PERFORMANCES_EXPORT: '/performance/export/',
    REFRESH: '/me/refresh/',
    TASKS: '/task/',
    TASK: '/task/:key/',
    TASK_INPUTS: '/task/:key/input_assets/',
    TASK_OUTPUTS: '/task/:key/output_assets/',
    TASK_PROFILING: '/task/:key/profiling',
    USERS: '/users/',
    USERS_AWAITING_APPROVAL: '/users-awaiting-approval/',
    USER: '/users/:key/',
    USER_SET_PWD: '/users/:key/set_password/',
    USER_RESET_TOKEN: '/users/:key/reset_password/',
    USER_CHECK_TOKEN: '/users/:key/verify_token/?token=:token',
    WORKFLOW: '/compute_plan/:key/workflow_graph/',
};

export const DOCS_API_PATHS = {
    RELEASES: '/en/latest/releases.json',
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
