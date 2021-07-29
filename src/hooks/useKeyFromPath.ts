import { useRoute } from 'wouter';

function useKeyFromPath(path: string): string | null {
    const [, params] = useRoute(path);
    if (params && params.key) {
        return params.key;
    }
    return null;
}

export default useKeyFromPath;
