/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { useRoute, Link } from 'wouter';

import AlgorithmIcon from '@/assets/svg/algorithm-icon';
import ComputePlanIcon from '@/assets/svg/compute-plan-icon';
import DatasetIcon from '@/assets/svg/dataset-icon';
import { Colors, Mixins, Spaces } from '@/assets/theme';
import { PATHS } from '@/routes';

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
        max-width: 190px;

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
    const renderLink = (label: string, url: string, icon: JSX.Element) => {
        const [isActive] = useRoute(url);

        return (
            <Link css={[linkStyle, isActive && activeLinkStyle]} href={url}>
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
            </Link>
        );
    };

    return (
        <div>
            {renderLink(
                'Datasets',
                PATHS.DATASETS,
                <DatasetIcon
                    css={css`
                        margin-left: 2px;
                    `}
                />
            )}
            {renderLink('Algos and Metrics', '/algorithms', <AlgorithmIcon />)}
            {renderLink(
                'Compute Plans',
                PATHS.COMPUTE_PLANS,
                <ComputePlanIcon />
            )}
        </div>
    );
};

export default Navigation;
