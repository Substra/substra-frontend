import { useCallback, useEffect } from 'react';

export function useKeyPress(targetKey: string, callback: () => void) {
    const upHandler = useCallback(
        ({ key }: KeyboardEvent): void => {
            if (key === targetKey) {
                callback();
            }
        },
        [targetKey, callback]
    );

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keyup', upHandler);

        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keyup', upHandler);
        };
    }, [upHandler]);
}
