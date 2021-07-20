import { Fragment } from 'react';

import { Link } from 'wouter';

import { InModel } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS } from '@/routes';

import { SiderSection, SiderSectionTitle } from '@/components/SiderSection';

interface InModelSiderSectionProps {
    title: string;
    model: InModel | undefined;
}

const InModelSiderSection = ({
    title,
    model,
}: InModelSiderSectionProps): JSX.Element => {
    return (
        <SiderSection>
            <SiderSectionTitle>{title}</SiderSectionTitle>
            {!model && 'No in model.'}
            {model && (
                <Fragment>
                    Out trunk model from task{' '}
                    <Link
                        href={compilePath(PATHS.TASK, {
                            key: model.traintuple_key,
                        })}
                    >
                        {model.traintuple_key}
                    </Link>
                </Fragment>
            )}
        </SiderSection>
    );
};

export default InModelSiderSection;
