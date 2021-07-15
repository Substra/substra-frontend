/** @jsxRuntime classic */
/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { useRoute, Link } from 'wouter';

import AlgorithmIcon from '@/assets/svg/algorithm-icon';
import ComputePlanIcon from '@/assets/svg/compute-plan-icon';
import DatasetIcon from '@/assets/svg/dataset-icon';
import { PATHS, ROUTES } from '@/routes';
import { Colors, Mixins, Spaces, zIndexes } from '@/assets/theme';

const Container = styled.div`
    position: fixed;
    top: 96px;
    left: ${Spaces.extraLarge};
    z-index: ${zIndexes.navigation};
`;

const linkStyle = css`
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 24px;
    height: 48px;
    max-width: 48px;
    border: 1px solid ${Colors.border};
    background-color: white;
    box-shadow: 0 0 8px 0 ${Colors.veryLightContent};
    padding: 0 ${Spaces.extraLarge} 0 11px;
    margin-bottom: ${Spaces.small};
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all ${Mixins.transitionStyle};
    color: ${Colors.primary};

    & > .icon {
        display: inline-flex;
        margin-right: ${Spaces.medium};
        width: 24px;
        height: 24px;
    }

    & > .label {
        opacity: 0;
        white-space: nowrap;
        transition: all ${Mixins.transitionStyle};
    }

    &:hover {
        max-width: 245px;

        & > .label {
            opacity: 1;
        }
    }
`;

const activeLinkStyle = css`
    border: 1px solid ${Colors.primary};
    background-color: ${Colors.darkerBackground};
`;

const Navigation = (): JSX.Element => {
    const renderLink = (
        label: string,
        routes: string[],
        path: string,
        icon: JSX.Element
    ) => {
        const isActive = routes.reduce((isActive, route) => {
            // We could add a test returning true if isActive is true before calling useRoute for
            // maximum efficiency but this would change the number of times the useRoute hook is
            // called and therefore make react break.
            const [isRouteActive] = useRoute(route);
            return isActive || isRouteActive;
        }, false);

        return (
            <Link css={[linkStyle, isActive && activeLinkStyle]} href={path}>
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
            </Link>
        );
    };
    return (
        <Container>
            {renderLink(
                'Datasets',
                [ROUTES.DATASETS.path],
                PATHS.DATASETS,
                <DatasetIcon
                    css={css`
                        margin-left: 2px;
                    `}
                />
            )}
            {renderLink(
                'Algos and Metrics',
                [ROUTES.ALGOS.path, ROUTES.METRICS.path],
                PATHS.ALGOS,
                <AlgorithmIcon />
            )}
            {renderLink(
                'Compute Plans and Tasks',
                [ROUTES.COMPUTE_PLANS.path, ROUTES.TASKS.path],
                PATHS.COMPUTE_PLANS,
                <ComputePlanIcon />
            )}
        </Container>
    );
};

export default Navigation;
