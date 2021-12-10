import { useEffect } from 'react';

type SetDocumentTitle = (title: string) => void;

const setDocumentTitle: SetDocumentTitle = (title) => {
    document.title = `${title} - Owkin Connect`;
};

export const useDocumentTitleEffect = (
    effect: (setDocumentTitle: SetDocumentTitle) => void,
    deps: React.DependencyList
): void => {
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
