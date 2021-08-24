import { Fragment } from 'react';

import { Link } from 'wouter';

import { InModel, OutModel } from '@/modules/tasks/TuplesTypes';

import { isInModel } from '@/libs/tuples';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

interface ModelSiderSectionProps {
    title: string;
    model: InModel | OutModel | undefined;
}

const ModelSiderSection = ({
    title,
    model,
}: ModelSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>{title}</SiderSectionTitle>
            {!model && `No ${title.toLowerCase()}.`}
            {model && (
                <Fragment>
                    {model.key}
                    <br />
                    {isInModel(model) && (
                        <Fragment>
                            {`${title} from task `}
                            <Link
                                href={compilePath(PATHS.TASK, {
                                    key: model.traintuple_key,
                                })}
                            >
                                {model.traintuple_key}
                            </Link>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </SiderSection>
    );
};

export default ModelSiderSection;
