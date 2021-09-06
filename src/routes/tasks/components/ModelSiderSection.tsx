import { Fragment } from 'react';

import { Model } from '@/modules/tasks/ModelsTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';
import StyledLink from '@/components/StyledLink';

interface ModelSiderSectionProps {
    title: string;
    model?: Model;
    sourceTupleTitle?: string;
}

const ModelSiderSection = ({
    title,
    model,
    sourceTupleTitle,
}: ModelSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>{title}</SiderSectionTitle>
            {!model && `No ${title.toLowerCase()}.`}
            {model && (
                <Fragment>
                    {model.key}
                    {sourceTupleTitle && (
                        <Fragment>
                            <br />
                            {`${sourceTupleTitle} `}
                            <StyledLink
                                href={compilePath(PATHS.TASK, {
                                    key: model.compute_task_key,
                                })}
                            >
                                {model.compute_task_key}
                            </StyledLink>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </SiderSection>
    );
};

export default ModelSiderSection;
