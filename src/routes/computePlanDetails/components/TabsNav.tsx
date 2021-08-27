/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { Link, useRoute } from 'wouter';

import { compilePath, PATHS, ROUTES } from '@/routes';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    width: 100%;
    display: flex;
    border-bottom: 1px solid ${Colors.border};
    cursor: pointer;
    margin-bottom: ${Spaces.medium};
`;

const linkStyle = css`
    padding-bottom: ${Spaces.small};
    margin-right: ${Spaces.large};
    border-bottom: 2px solid;
    border-bottom-color: transparent;
    font-size: ${Fonts.sizes.button};
    color: ${Colors.lightContent};
    text-decoration: none;
`;

const activeLinkStyle = css`
    border-bottom-color: ${Colors.primary};
    font-weight: bold;
    color: ${Colors.primary};
`;

const TabsNav = (): JSX.Element => {
    const [isChart, chartParams] = useRoute(ROUTES.COMPUTE_PLAN_CHART.path);
    const [isTasks, tasksParams] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const computePlanKey = chartParams?.key || tasksParams?.key || '';
    return (
        <Container>
            <Link
                css={[linkStyle, isChart && activeLinkStyle]}
                href={compilePath(PATHS.COMPUTE_PLAN_CHART, {
                    key: computePlanKey,
                })}
            >
                Performance chart
            </Link>
            <Link
                css={[linkStyle, isTasks && activeLinkStyle]}
                href={compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                    key: computePlanKey,
                })}
            >
                Tasks list
            </Link>
        </Container>
    );
};

export default TabsNav;
