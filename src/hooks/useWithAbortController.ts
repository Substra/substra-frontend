import { useRef } from 'react';

const useWithAbortController = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    return (
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
    };
};
export default useWithAbortController;
