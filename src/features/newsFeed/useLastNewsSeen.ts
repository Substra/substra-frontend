import { useLocalStorageState } from '@/hooks/useLocalStorageState';

const useLastNewsSeen = (): {
    lastNewsSeen: string;
    setLastNewsSeen: (item: string) => void;
} => {
    const [state, setState] = useLocalStorageState<string>(
        'last_news_seen',
        ''
    );

    return {
        lastNewsSeen: state,
        setLastNewsSeen: setState,
    };
};

export default useLastNewsSeen;
