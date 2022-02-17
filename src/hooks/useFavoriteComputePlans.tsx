import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import useLocalStorageItems from '@/hooks/useLocalStorageItems';

const useFavoriteComputePlans = (): {
    favorites: ComputePlanT[];
    addToFavorites: (computePlan: ComputePlanT) => void;
    removeFromFavorites: (computePlan: ComputePlanT) => void;
    isFavorite: (computePlan: ComputePlanT) => boolean;
    onFavoriteChange: (computePlan: ComputePlanT) => () => void;
} => {
    const {
        items: favorites,
        addItem: addToFavorites,
        removeItem: removeFromFavorites,
    } = useLocalStorageItems<ComputePlanT>('pinned_compute_plans');

    const isFavorite = (computePlan: ComputePlanT): boolean => {
        return !!favorites.find((cp) => cp.key === computePlan.key);
    };

    const onFavoriteChange = (computePlan: ComputePlanT) => () => {
        if (isFavorite(computePlan)) {
            removeFromFavorites(computePlan);
        } else {
            addToFavorites(computePlan);
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
