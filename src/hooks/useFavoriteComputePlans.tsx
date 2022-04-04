import { useLocalStorageStringItems } from '@/hooks/useLocalStorageItems';

const useFavoriteComputePlans = (): {
    favorites: string[];
    addToFavorites: (favorite: string) => void;
    removeFromFavorites: (favorite: string) => void;
    isFavorite: (cpKey: string) => boolean;
    onFavoriteChange: (cpKey: string) => () => void;
} => {
    const {
        items: favorites,
        includesItem: isFavorite,
        addItem: addToFavorites,
        removeItem: removeFromFavorites,
    } = useLocalStorageStringItems('favorite_compute_plans');

    const onFavoriteChange = (cpKey: string) => () => {
        if (isFavorite(cpKey)) {
            removeFromFavorites(cpKey);
        } else {
            addToFavorites(cpKey);
        }
    };

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        onFavoriteChange,
    };
};
export default useFavoriteComputePlans;
