import { RiEyeOffLine } from 'react-icons/ri';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import EmptyState from '@/components/EmptyState';

type UnavailableWorkflowProps = {
    subtitle: string;
};

const UnavailableWorkflow = ({
    subtitle,
}: UnavailableWorkflowProps): JSX.Element => {
    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Workflow unavailable'),
        []
    );

    return (
        <EmptyState
            icon={<RiEyeOffLine />}
            title="Unable to display this workflow"
            subtitle={subtitle}
        />
    );
};

export default UnavailableWorkflow;
