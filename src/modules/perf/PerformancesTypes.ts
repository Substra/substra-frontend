export type PerformanceT = {
    compute_task: {
        key: string;
        data_manager_key: string;
        function_key: string;
        rank: number;
        round_idx: string | null;
        data_samples: string[];
        worker: string;
    };
    metric: {
        key: string;
        name: string;
        output_identifier: string;
    };
    perf: number | null;
};

export type PerformanceAssetT = {
    channel: string;
    compute_task_key: string;
    creation_date: string;
    metric_key: string;
    performance_value: number;
};

export type ComputePlanStatisticsT = {
    compute_tasks_distinct_ranks: number[];
    compute_tasks_distinct_rounds: number[];
};
