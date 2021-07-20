import { useEffect } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';

import { retrieveAlgo, retrieveDescription } from '@/modules/algos/AlgosSlice';
import { AlgoType } from '@/modules/algos/AlgosTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
} from '@/hooks';

import { PATHS, useKeyFromPath } from '@/routes';

import DescriptionSiderSection, {
    LoadingDescriptionSiderSection,
} from '@/components/DescriptionSiderSection';
import KeySiderSection from '@/components/KeySiderSection';
import PermissionSiderSection from '@/components/PermissionSiderSection';
import Sider from '@/components/Sider';
import SiderBottomButton from '@/components/SiderBottomButton';
import { SimpleSiderSection } from '@/components/SiderSection';

const AlgoSider = (): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();
    const key = useKeyFromPath(PATHS.ALGO);

    const visible = !!key;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(retrieveAlgo(key))
                .then(unwrapResult)
                .then((algo: AlgoType) => {
                    dispatch(
                        retrieveDescription(algo.description.storage_address)
                    );
                });
        }
    }, [key]);

    const algo = useAppSelector((state) => state.algos.algo);
    const description = useAppSelector((state) => state.algos.description);
    const descriptionLoading = useAppSelector(
        (state) => state.algos.descriptionLoading
    );

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() =>
                setSearchFiltersLocation(PATHS.ALGOS, searchFilters)
            }
            titleType="Algorithm details"
            title={algo ? algo.name : 'Algorithm name'}
        >
            <KeySiderSection assetKey={key || ''} />

            {descriptionLoading && <LoadingDescriptionSiderSection />}
            {!descriptionLoading && !description && (
                <SimpleSiderSection title="Description" content="N/A" />
            )}
            {!descriptionLoading && description && (
                <DescriptionSiderSection description={description} />
            )}

            {algo && (
                <PermissionSiderSection permission={algo.permissions.process} />
            )}
            {algo && (
                <SiderBottomButton
                    target={algo.content.storage_address}
                    filename={`algo-${key}.zip`}
                >
                    Download algo
                </SiderBottomButton>
            )}
        </Sider>
    );
};

export default AlgoSider;
