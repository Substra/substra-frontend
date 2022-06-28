import { HStack, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';

import {
    useDuration,
    useFavoritesOnly,
    useMetadataWithUUID,
    useSyncedDateStringState,
    useSyncedStringArrayState,
} from '@/hooks/useSyncedState';
import { getStatusLabel } from '@/libs/status';
import { formatDuration } from '@/libs/utils';
import { MetadataFilterWithUUID } from '@/modules/metadata/MetadataTypes';

interface TableFilterTagsProps {
    children: React.ReactNode | React.ReactNode[];
}

export const TableFilterTags = ({
    children,
}: TableFilterTagsProps): JSX.Element => <HStack>{children}</HStack>;

interface FilterTagProps {
    label: string | JSX.Element;
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

const FilterTagLabel = ({
    title,
    content,
}: {
    title: string;
    content: string;
}): JSX.Element => (
    <>
        <Text as="span" fontWeight="semibold" marginRight="1">
            {title}
        </Text>
        <Text as="span">{content}</Text>
    </>
);

interface MultipleFilterTagProps {
    label: string;
    syncedArrayStateName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter?: (value: any) => string;
}
const MultipleFilterTag = ({
    label,
    syncedArrayStateName,
    formatter,
}: MultipleFilterTagProps): JSX.Element | null => {
    const [values, setValues] = useSyncedStringArrayState(
        syncedArrayStateName,
        []
    );

    const clear = () => {
        setValues([]);
    };

    if (values.length > 0) {
        return (
            <FilterTag
                label={
                    <FilterTagLabel
                        title={label}
                        content={values
                            .map((v) => (formatter ? formatter(v) : v))
                            .join(', ')}
                    />
                }
                clear={clear}
            />
        );
    }

    return null;
};

export const OwnerTableFilterTag = (): JSX.Element | null => (
    <MultipleFilterTag label="Owner" syncedArrayStateName="owner" />
);

export const WorkerTableFilterTag = (): JSX.Element | null => (
    <MultipleFilterTag label="Worker" syncedArrayStateName="worker" />
);

export const PermissionsTableFilterTag = (): JSX.Element | null => (
    <MultipleFilterTag label="Permissions" syncedArrayStateName="can_process" />
);

export const LogsAccessTableFilterTag = (): JSX.Element | null => (
    <MultipleFilterTag
        label="Logs access"
        syncedArrayStateName="can_access_logs"
    />
);

export const StatusTableFilterTag = (): JSX.Element | null => (
    <MultipleFilterTag
        label="Status"
        syncedArrayStateName="status"
        formatter={getStatusLabel}
    />
);

export const FavoritesTableFilterTag = (): JSX.Element | null => {
    const [favoritesOnly, setFavoritesOnly] = useFavoritesOnly();

    const clear = () => {
        setFavoritesOnly(false);
    };

    if (favoritesOnly) {
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
    const [dateBefore, setDateBefore] = useSyncedDateStringState(
        `${urlParam}_before`,
        ''
    );
    const [dateAfter, setDateAfter] = useSyncedDateStringState(
        `${urlParam}_after`,
        ''
    );

    const clear = () => {
        setDateBefore('');
        setDateAfter('');
    };

    if (dateBefore && dateAfter) {
        return (
            <FilterTag
                label={
                    <FilterTagLabel
                        title={label}
                        content={`between ${dateAfter} and ${dateBefore}`}
                    />
                }
                clear={clear}
            />
        );
    } else if (dateBefore) {
        return (
            <FilterTag
                label={
                    <FilterTagLabel
                        title={label}
                        content={`before ${dateBefore}`}
                    />
                }
                clear={clear}
            />
        );
    } else if (dateAfter) {
        return (
            <FilterTag
                label={
                    <FilterTagLabel
                        title={label}
                        content={`after ${dateAfter}`}
                    />
                }
                clear={clear}
            />
        );
    }
    return null;
};

export const MetadataFilterTag = (): JSX.Element | null => {
    const [filters, setFilters] = useMetadataWithUUID();

    const clear = (filter: MetadataFilterWithUUID) => () => {
        setFilters(filters.filter((f) => f.uuid !== filter.uuid));
    };

    if (filters.length) {
        return (
            <>
                {filters.map((filter) => (
                    <FilterTag
                        key={filter.uuid}
                        label={
                            <FilterTagLabel
                                title="Metadata"
                                content={`${filter.key} ${filter.type} ${
                                    filter.value ?? ''
                                }`.trimEnd()}
                            />
                        }
                        clear={clear(filter)}
                    />
                ))}
            </>
        );
    }
    return null;
};

export const DurationFilterTag = () => {
    const { durationMin, setDurationMin, durationMax, setDurationMax } =
        useDuration();

    const clear = () => {
        setDurationMin(undefined);
        setDurationMax(undefined);
    };

    let content = null;
    if (durationMin !== undefined && durationMax !== undefined) {
        content = `between ${formatDuration(durationMin)} and ${formatDuration(
            durationMax
        )}`;
    } else if (durationMax) {
        content = `below ${formatDuration(durationMax)}`;
    } else if (durationMin) {
        content = `above ${formatDuration(durationMin)}`;
    }

    if (content === null) {
        return null;
    }

    return (
        <FilterTag
            label={<FilterTagLabel title="Duration" content={content} />}
            clear={clear}
        />
    );
};
