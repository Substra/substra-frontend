import { useEffect } from 'react';

type SetDocumentTitleT = (title: string) => void;

const setDocumentTitle: SetDocumentTitleT = (title) => {
    document.title = `${title} - Substra`;
};

export const useDocumentTitleEffect = (
    effect: (setDocumentTitle: SetDocumentTitleT) => void,
    deps: React.DependencyList
): void => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => effect(setDocumentTitle), deps);
};

export const useAssetListDocumentTitleEffect = (
    title: string,
    key: string | null
): void => {
    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (!key) {
                setDocumentTitle(title);
            }
        },
        [key]
    );
};
