import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAppDispatch, useAppSelector } from '@/hooks';

import KeySiderSection from '@/components/KeySiderSection';
import { retrieveAlgo, retrieveDescription } from '@/modules/algos/AlgosSlice';
import { PATHS, useKeyFromPath } from '@/routes';
import { unwrapResult } from '@reduxjs/toolkit';
import SiderBottomButton from '@/components/SiderBottomButton';
import { AlgoType } from '@/modules/algos/AlgosTypes';
import PermissionSiderSection from '@/components/PermissionSiderSection';
import Sider from '@/components/Sider';
import DescriptionSiderSection, {
    LoadingDescriptionSiderSection,
} from '@/components/DescriptionSiderSection';
import { SimpleSiderSection } from '@/components/SiderSection';

const AlgoSider = (): JSX.Element => {
    const [, setLocation] = useLocation();
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
            onCloseButtonClick={() => setLocation(PATHS.ALGOS)}
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
                <SiderBottomButton target={algo.content.storage_address}>
                    Download algo
                </SiderBottomButton>
            )}
        </Sider>
    );
};

export default AlgoSider;
