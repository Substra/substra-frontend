import { useEffect, useRef } from 'react';

const useEffectWithAbortController = (
    callback: (
        abortController: AbortController
    ) => ReturnType<React.EffectCallback>,
    deps: React.DependencyList
) => {
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const res = callback(abortControllerRef.current);
        if (res) {
            return res;
        } else {
            return () => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
            };
        }
    }, deps);
};
export default useEffectWithAbortController;
