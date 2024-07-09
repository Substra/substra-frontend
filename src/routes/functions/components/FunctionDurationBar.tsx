import { useEffect } from 'react';

import ProfilingDurationBar from '@/components/ProfilingDurationBar';

import { functionStepsInfo } from '../FunctionsUtils';
import useFunctionStore from '../useFunctionStore';

const FunctionDurationBar = ({
    functionKey,
}: {
    functionKey: string | null | undefined;
}): JSX.Element => {
    const {
        functionProfiling,
        fetchingFunctionProfiling,
        fetchFunctionProfiling,
    } = useFunctionStore();

    useEffect(() => {
        if (functionKey) {
            fetchFunctionProfiling(functionKey);
        }
    }, [fetchFunctionProfiling, functionKey]);

    return (
        <ProfilingDurationBar
            execution_rundown={functionProfiling?.execution_rundown || []}
            duration={functionProfiling?.duration || null}
            loading={fetchingFunctionProfiling}
            title="Build duration"
            stepsInfo={functionStepsInfo}
        />
    );
};

export default FunctionDurationBar;
