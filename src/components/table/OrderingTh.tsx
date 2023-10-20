import { Fragment } from 'react';

import {
    HStack,
    Th,
    Text,
    Icon,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Flex,
    TableColumnHeaderProps,
} from '@chakra-ui/react';
import {
    RiArrowDownSLine,
    RiCheckLine,
    RiFilter3Fill,
    RiSortAsc,
    RiSortDesc,
} from 'react-icons/ri';

import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useLocationWithParams';
import { useSyncedStringState } from '@/hooks/useSyncedState';

type OrderingOptionProps = {
    label: string;
    asc?: { label: string; value: string };
    desc?: { label: string; value: string };
};

const OrderingMenuItem = ({
    label,
    value,
    direction,
}: {
    label: string;
    value: string;
    direction: 'asc' | 'desc';
}): JSX.Element => {
    const [ordering] = useSyncedStringState('ordering', '');
    const setLocationParams = useSetLocationParams();

    return (
        <MenuItem
            color={value === ordering ? 'primary' : ''}
            fontWeight={value === ordering ? 'semibold' : ''}
            icon={
                value === ordering ? (
                    <RiCheckLine />
                ) : direction === 'asc' ? (
                    <RiSortAsc />
                ) : (
                    <RiSortDesc />
                )
            }
            onClick={() => {
                const urlSearchParams = getUrlSearchParams();
                urlSearchParams.set('ordering', value);
                urlSearchParams.set('page', '1');
                setLocationParams(urlSearchParams);
            }}
        >
            {label}
        </MenuItem>
    );
};

const OrderingToggle = ({ label, asc, desc }: OrderingOptionProps) => {
    const [ordering] = useSyncedStringState('ordering', '');
    const setLocationParams = useSetLocationParams();

    if (asc === undefined || desc === undefined) {
        return <Text>{label}</Text>;
    } else if (ordering === asc.value) {
        return (
            <Flex
                color="primary"
                cursor="pointer"
                onClick={() => {
                    const urlSearchParams = getUrlSearchParams();
                    urlSearchParams.set('ordering', desc.value);
                    urlSearchParams.set('page', '1');
                    setLocationParams(urlSearchParams);
                }}
            >
                <Icon as={RiSortAsc} marginTop="1px" />
                <Text>{label}</Text>
            </Flex>
        );
    } else if (ordering === desc.value) {
        return (
            <Flex
                cursor="pointer"
                color="primary"
                onClick={() => {
                    const urlSearchParams = getUrlSearchParams();
                    urlSearchParams.set('ordering', asc.value);
                    urlSearchParams.set('page', '1');
                    setLocationParams(urlSearchParams);
                }}
            >
                <Icon as={RiSortDesc} marginTop="1px" />
                <Text>{label}</Text>
            </Flex>
        );
    } else {
        return (
            <Text
                cursor="pointer"
                onClick={() => {
                    const urlSearchParams = getUrlSearchParams();
                    urlSearchParams.set('ordering', desc.value);
                    urlSearchParams.set('page', '1');
                    setLocationParams(urlSearchParams);
                }}
            >
                {label}
            </Text>
        );
    }
};

type OrderingThProps = TableColumnHeaderProps & {
    options: OrderingOptionProps[];
    openFilters?: () => void;
};
const OrderingTh = ({ options, openFilters, ...props }: OrderingThProps) => {
    return (
        <Th {...props}>
            <Flex justifyContent="space-between">
                <HStack spacing="1">
                    {options.map((option, index) => (
                        <Fragment key={option.label}>
                            <OrderingToggle {...option} />
                            {index !== options.length - 1 && <Text>/</Text>}
                        </Fragment>
                    ))}
                </HStack>
                <Menu placement="bottom-end">
                    <MenuButton
                        as={IconButton}
                        aria-label="More actions"
                        icon={
                            <Icon
                                as={RiArrowDownSLine}
                                width="14px"
                                height="14px"
                            />
                        }
                        variant="ghost"
                        size="xs"
                        data-cy="th-menu-button"
                    />
                    <MenuList zIndex="popover" fontFamily="Inter">
                        {openFilters && (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        setTimeout(openFilters, 50);
                                    }}
                                    icon={<RiFilter3Fill />}
                                    data-cy="open-filters"
                                >
                                    Filter
                                </MenuItem>
                                <MenuDivider />
                            </>
                        )}
                        {options.map(({ label, asc, desc }) => (
                            <Fragment key={label}>
                                {desc && (
                                    <OrderingMenuItem
                                        {...desc}
                                        direction="desc"
                                    />
                                )}
                                {asc && (
                                    <OrderingMenuItem
                                        {...asc}
                                        direction="asc"
                                    />
                                )}
                            </Fragment>
                        ))}
                    </MenuList>
                </Menu>
            </Flex>
        </Th>
    );
};
export default OrderingTh;
