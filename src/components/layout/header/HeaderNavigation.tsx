import styled from '@emotion/styled';

import { useHrefLocation } from '@/hooks/useLocationWithParams';
import { useOrdering } from '@/hooks/useSyncedState';
import { PATHS } from '@/paths';
import useComputePlansStore from '@/routes/computePlans/useComputePlansStore';
import useDatasetsStore from '@/routes/datasets/useDatasetsStores';
import useFunctionsStore from '@/routes/functions/useFunctionsStore';
import useTasksStore from '@/routes/tasks/useTasksStore';

const Nav = styled.nav`
    display: flex;
    align-self: stretch;
`;

const Ol = styled.ol`
    display: flex;
    align-self: stretch;
`;

const Li = styled.li`
    display: flex;
    align-items: stretch;
    font-family: Gattica;

    &:not(:last-child) {
        margin-right: var(--chakra-space-5);
    }
`;

type AProps = {
    active: boolean;
    onClick: (path: string) => void;
};
const A = styled.a<AProps>`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: var(--chakra-fontSizes-sm);
    font-weight: var(--chakra-fontWeights-medium);
    line-height: var(--chakra-lineHeights-5);
    border-bottom: 2px solid
        ${({ active }) =>
            active ? 'var(--chakra-colors-primary-500)' : 'transparent'};
    color: ${({ active }) =>
        active
            ? 'var(--chakra-colors-gray-800)'
            : 'var(--chakra-colors-gray-500)'};
`;

type HeaderNavigationProps = {
    navItems: {
        label: string;
        href: string;
        paths: string[];
    }[];
    isActive: (paths: string[]) => boolean;
};
const HeaderNavigation = ({
    navItems,
    isActive,
}: HeaderNavigationProps): JSX.Element => {
    const [, setHrefLocation] = useHrefLocation();

    const [ordering] = useOrdering('-creation_date');

    const { fetchComputePlans } = useComputePlansStore();
    const { fetchTasks } = useTasksStore();
    const { fetchDatasets } = useDatasetsStore();
    const { fetchFunctions } = useFunctionsStore();

    // used to reload asset list when clicking on tab that is already active
    const reload = (href: string) => {
        switch (href) {
            case PATHS.COMPUTE_PLANS:
                fetchComputePlans({ ordering });
                break;
            case PATHS.TASKS:
                fetchTasks({ ordering });
                break;
            case PATHS.DATASETS:
                fetchDatasets({ ordering });
                break;
            case PATHS.FUNCTIONS:
                fetchFunctions({ ordering });
                break;
            default:
                console.error('Reload error');
        }
    };

    /**
     * This component follows the accessibility recommendations of the W3C
     * https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html
     * */
    return (
        <Nav>
            <Ol role="menubar">
                {navItems.map(({ label, href, paths }) => (
                    <Li role="none" key={href}>
                        <A
                            role="menuitem"
                            active={isActive(paths)}
                            onClick={() => {
                                if (href === window.location.pathname) {
                                    reload(href);
                                }
                                setHrefLocation(href);
                            }}
                        >
                            {label}
                        </A>
                    </Li>
                ))}
            </Ol>
        </Nav>
    );
};

export default HeaderNavigation;
