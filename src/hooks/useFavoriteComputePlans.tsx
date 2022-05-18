import { useLocalStorageStringArrayState } from '@/hooks/useLocalStorageState';

const useFavoriteComputePlans = (): {
    favorites: string[];
    setFavorites: (favorites: string[]) => void;
    addToFavorites: (favorite: string) => void;
    removeFromFavorites: (favorite: string) => void;
    isFavorite: (cpKey: string) => boolean;
    onFavoriteChange: (cpKey: string) => () => void;
} => {
    const {
        state: favorites,
        setState: setFavorites,
        includesItem: isFavorite,
        addItem: addToFavorites,
        removeItem: removeFromFavorites,
    } = useLocalStorageStringArrayState('favorite_compute_plans');

    const onFavoriteChange = (cpKey: string) => () => {
        if (isFavorite(cpKey)) {
            removeFromFavorites(cpKey);
        } else {
            addToFavorites(cpKey);
        }
    };

    return {
        favorites,
        setFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        onFavoriteChange,
    };
};
export default useFavoriteComputePlans;
