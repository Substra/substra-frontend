import { HStack, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';

import {
    useSyncedDateStringState,
    useSyncedStringArrayState,
} from '@/hooks/useSyncedState';
import { getStatusLabel } from '@/libs/status';
import { AlgoCategory } from '@/modules/algos/AlgosTypes';
import { CATEGORY_LABEL } from '@/modules/algos/AlgosUtils';

interface TableFilterTagsProps {
    children: React.ReactNode | React.ReactNode[];
}

export const TableFilterTags = ({
    children,
}: TableFilterTagsProps): JSX.Element => <HStack>{children}</HStack>;

interface FilterTagProps {
    label: string;
    clear: () => void;
}
const FilterTag = ({ label, clear, ...props }: FilterTagProps): JSX.Element => (
    <Tag
        size="md"
        variant="outline"
        colorScheme="gray"
        backgroundColor="white"
        color="gray.800"
        boxShadow="0 0 0px 1px var(--chakra-colors-gray-100)"
        {...props}
    >
        <TagLabel>{label}</TagLabel>
        <TagCloseButton onClick={clear} />
    </Tag>
);

interface CounterFilterTagProps {
    label: string;
    assetKey: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter?: (value: any) => string;
}
const CounterFilterTag = ({
    label,
    assetKey,
    formatter,
}: CounterFilterTagProps): JSX.Element | null => {
    const [assetKeys, setAssetKeys] = useSyncedStringArrayState(
        `${assetKey}`,
        []
    );

    const clear = () => {
        setAssetKeys([]);
    };

    if (assetKeys.length === 1) {
        return (
            <FilterTag
                label={formatter ? formatter(assetKeys[0]) : assetKeys[0]}
                clear={clear}
            />
        );
    } else if (assetKeys.length > 1) {
        return (
            <FilterTag label={`${label} (${assetKeys.length})`} clear={clear} />
        );
    }

    return null;
};

export const OwnerTableFilterTag = (): JSX.Element | null => (
    <CounterFilterTag label="Owners" assetKey="owner" />
);

export const WorkerTableFilterTag = (): JSX.Element | null => (
    <CounterFilterTag label="Workers" assetKey="worker" />
);

export const StatusTableFilterTag = (): JSX.Element | null => (
    <CounterFilterTag
        label="Status"
        assetKey="status"
        formatter={getStatusLabel}
    />
);

export const AlgoCategoryTableFilterTag = (): JSX.Element | null => {
    const [categories, setCategories] = useSyncedStringArrayState(
        'category',
        []
    );

    const clear = (category: string) => () => {
        setCategories(categories.filter((c) => c !== category));
    };

    if (categories.length) {
        return (
            <>
                {categories.map((category) => (
                    <FilterTag
                        key={category}
                        label={CATEGORY_LABEL[category as AlgoCategory]}
                        clear={clear(category)}
                    />
                ))}
            </>
        );
    }

    return null;
};

export const FavoritesTableFilterTag = (): JSX.Element | null => {
    const [keys, setKeys] = useSyncedStringArrayState('key', []);

    const clear = () => {
        setKeys([]);
    };

    if (keys.length) {
        return <FilterTag label="Favorites Only" clear={clear} />;
    }

    return null;
};

export const DateFilterTag = ({
    urlParam,
    label,
}: {
    urlParam: string;
    label: string;
}) => {
    const [date, setDate] = useSyncedDateStringState(urlParam, '');
    const clear = () => {
        setDate('');
    };
    if (date) {
        return <FilterTag label={label} clear={clear} />;
    }
    return null;
};
