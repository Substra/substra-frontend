import { useRoute } from 'wouter';

function useKeyFromPath(path: string, paramName = 'key'): string | null {
    const [, params] = useRoute(path);
    if (params && params[paramName]) {
        return params[paramName];
    }
    return null;
}

export default useKeyFromPath;
