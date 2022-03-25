import { useEffect } from 'react';

export function useKeyPress(targetKey: string, callback: () => void) {
    const upHandler = ({ key }: KeyboardEvent): void => {
        if (key === targetKey) {
            callback();
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener('keyup', upHandler);

        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
}
