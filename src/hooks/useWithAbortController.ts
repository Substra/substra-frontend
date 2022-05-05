import { useCallback, useRef } from 'react';

const useWithAbortController = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    const withAbortController = useCallback(
        (
            callback: (abortController: AbortController) => void
        ): (() => void) => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            callback(abortControllerRef.current);

            return () => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
            };
        },
        [abortControllerRef]
    );
    return withAbortController;
};
export default useWithAbortController;
