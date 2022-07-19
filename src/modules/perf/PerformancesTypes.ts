export type PerformanceT = {
    compute_task: {
        key: string;
        data_manager_key: string;
        algo_key: string;
        rank: number;
        round_idx: string | null;
        data_samples: string[];
        worker: string;
    };
    metric: {
        key: string;
        name: string;
    };
    perf: number | null;
};
