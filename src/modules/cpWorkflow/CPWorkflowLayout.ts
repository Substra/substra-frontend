import {
    LayoutedTaskGraphT,
    TaskGraphT,
    WorkflowTaskT,
} from '@/modules/cpWorkflow/CPWorkflowTypes';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 119;

const NODE_BOTTOM_MARGIN = 71; // Add margin to the node height avoid stacking nodes
const ROW_BOTTOM_MARGIN = 30;
const CELL_WIDTH = NODE_WIDTH + 150;

type TaskInCellT = {
    taskRef: WorkflowTaskT;
    relativeXInCell: number;
    relativeYInCell: number;
};

type GridCellT = {
    tasks: TaskInCellT[];
    x: number;
    y: number;
};

type GridRowT = {
    maxNbTasksInACell: number;
    cells: GridCellT[];
    y: number;
    height: number;
};

type RowsT = {
    [workerName: string]: GridRowT;
};

type GridT = {
    workerNamesInYOrder: string[];
    rows: RowsT;
};

function initEmptyGrid(workerNamesInYOrder: string[], maxRank: number) {
    const grid: GridT = {
        workerNamesInYOrder: workerNamesInYOrder,
        rows: {},
    };
    for (const workerName of workerNamesInYOrder) {
        grid.rows[workerName] = {
            maxNbTasksInACell: 0,
            cells: Array.from({ length: maxRank + 1 }, (_, index) => ({
                tasks: [],
                x: 0,
                y: (index % 2) * 8, // Add a small vertical padding every 2 column to help avoiding some edges to overlap
            })),
            y: 0,
            height: 0,
        };
    }
    return grid;
}

function getColumnIndex(
    task: WorkflowTaskT,
    taskRankInSecondaryBranch: { [task_key: string]: number }
) {
    const correctedRank: number =
        task.rank - (taskRankInSecondaryBranch[task.key] ?? 0);
    return Math.max(0, correctedRank);
}

function addTasksToGrid(
    grid: GridT,
    tasks: WorkflowTaskT[],
    taskRankInSecondaryBranch: { [task_key: string]: number }
) {
    // Assign tasks to their cell
    for (const task of tasks) {
        const cell =
            grid.rows[task.worker].cells[
                getColumnIndex(task, taskRankInSecondaryBranch)
            ];
        cell.tasks.push({
            taskRef: task,
            relativeXInCell: 0,
            relativeYInCell: 0,
        });
    }

    // Update maxNbTasksInACell for all rows
    for (const row of Object.values(grid.rows)) {
        row.maxNbTasksInACell = Math.max(
            ...row.cells.map((cell) => cell.tasks.length)
        );
    }
}

function computeRowsHeight(rows: RowsT) {
    for (const row of Object.values(rows)) {
        row.height =
            row.maxNbTasksInACell * (NODE_HEIGHT + NODE_BOTTOM_MARGIN) +
            ROW_BOTTOM_MARGIN;
    }
}

function computeRowsY(grid: GridT) {
    for (const [index, workerName] of grid.workerNamesInYOrder.entries()) {
        const row = grid.rows[workerName];
        if (index === 0) {
            row.y = 0;
        } else {
            const previousWorkerName = grid.workerNamesInYOrder[index - 1];
            const previousRow = grid.rows[previousWorkerName];
            row.y = previousRow.y + previousRow.height;
        }
    }
}

function computeCellsX(rows: RowsT) {
    for (const row of Object.values(rows)) {
        for (const [index, cell] of row.cells.entries()) {
            cell.x = index * CELL_WIDTH;
        }
    }
}

function orderTasksInEachCell(
    rows: RowsT,
    taskKeyToParentTasksMap: { [task_key: string]: WorkflowTaskT[] }
) {
    for (const row of Object.values(rows)) {
        for (const cell of row.cells) {
            cell.tasks.sort((firstTask, secondTask) => {
                function makeSortName(task: WorkflowTaskT): string {
                    // recursive function chaining the key of all ancestor tasks in the cell
                    // Needed to stack vertically train, then predict, then test task
                    const parentTasks = taskKeyToParentTasksMap[task.key] ?? [];
                    return parentTasks.map(makeSortName).join() + task.key;
                }

                const firstNodeSortName = makeSortName(firstTask.taskRef);
                const secondNodeSortName = makeSortName(secondTask.taskRef);
                if (firstNodeSortName < secondNodeSortName) {
                    return -1;
                }
                if (firstNodeSortName > secondNodeSortName) {
                    return 1;
                }
                return 0;
            });
        }
    }
}

function computeTasksRelativePositionInCell(
    rows: RowsT,
    taskRankInSecondaryBranch: { [task_key: string]: number }
) {
    function computeTaskRelativePositionInCell(
        task: TaskInCellT,
        cell: GridCellT
    ) {
        task.relativeXInCell = 0;
        task.relativeYInCell =
            cell.tasks.indexOf(task) * (NODE_HEIGHT + NODE_BOTTOM_MARGIN);

        const rankInSecondaryBranch =
            taskRankInSecondaryBranch[task.taskRef.key];
        if (rankInSecondaryBranch) {
            task.relativeXInCell += rankInSecondaryBranch * 30;
        }
    }

    for (const row of Object.values(rows)) {
        for (const cell of row.cells) {
            for (const task of cell.tasks) {
                computeTaskRelativePositionInCell(task, cell);
            }
        }
    }
}

function findSecondaryBranches(
    graph: TaskGraphT,
    taskKeyToParentTasksMap: { [task_key: string]: WorkflowTaskT[] }
): { [task_key: string]: number } {
    function producesOnlyPerformances(task: WorkflowTaskT) {
        const outputKinds = new Set(
            Object.values(task.outputs).map((output) => output.kind)
        );
        return (
            outputKinds.size === 1 &&
            outputKinds.values().next().value === 'ASSET_PERFORMANCE'
        );
    }

    function computeNbOfChildren(graph: TaskGraphT, task: WorkflowTaskT) {
        return graph.edges.filter((edge) => edge.source_task_key === task.key)
            .length;
    }

    // Recusrsive function to walk through parent tasks as long as it is a linear chain to find the secondary branch
    function recFindSecondaryBranch(
        task: WorkflowTaskT,
        graph: TaskGraphT,
        taskKeyToParentTasksMap: { [task_key: string]: WorkflowTaskT[] },
        tasksInSecondaryBranches: { [task_key: string]: number }
    ) {
        const parents: WorkflowTaskT[] = Object.values(
            taskKeyToParentTasksMap[task.key]
        );
        if (parents.length === 0) {
            // The secondary branch is not connected to the rest of the workflow
            // Let us not tune the layout for this specific case. Could be a single train task chain
            return null;
        } else if (parents.length === 1) {
            const parent = parents[0];

            if (computeNbOfChildren(graph, parent) === 1) {
                // The parent has no other child than this task, it is part of the secondary branch
                // We recursively continue to walk through its parents
                const parentRankInSecondaryBranch = recFindSecondaryBranch(
                    parent,
                    graph,
                    taskKeyToParentTasksMap,
                    tasksInSecondaryBranches
                );
                if (parentRankInSecondaryBranch !== null) {
                    tasksInSecondaryBranches[task.key] =
                        parentRankInSecondaryBranch + 1;
                    return tasksInSecondaryBranches[task.key];
                } else {
                    return null;
                }
            } else {
                // The parent has other children so it is the point where the secondary branch starts
                // The task is first in the secondary branch
                tasksInSecondaryBranches[task.key] = 1;
                return tasksInSecondaryBranches[task.key];
            }
        } else {
            // The task has several parents so it is not in the secondary branch
            return 0;
        }
    }

    const taskRanksInSecondaryBranch: { [task_key: string]: number } = {};

    const endOfSecondaryBranches = graph.tasks.filter((task) => {
        return (
            computeNbOfChildren(graph, task) === 0 &&
            producesOnlyPerformances(task)
        );
    });

    for (const task of endOfSecondaryBranches) {
        recFindSecondaryBranch(
            task,
            graph,
            taskKeyToParentTasksMap,
            taskRanksInSecondaryBranch
        );
    }

    return taskRanksInSecondaryBranch;
}

export function computeLayout(graph: TaskGraphT): LayoutedTaskGraphT {
    const workerNames = [...new Set(graph.tasks.map((task) => task.worker))];
    workerNames.sort();

    const taskKeyToTaskMap: { [task_key: string]: WorkflowTaskT } = {};
    for (const task of graph.tasks) {
        taskKeyToTaskMap[task.key] = task;
    }

    const taskKeyToParentTasksMap: { [task_key: string]: WorkflowTaskT[] } = {};
    for (const edge of graph.edges) {
        const targetTaskKey = edge.target_task_key;
        const parentTask = taskKeyToTaskMap[edge.source_task_key];

        const parentTasks = taskKeyToParentTasksMap[targetTaskKey] ?? [];
        if (!parentTasks.includes(parentTask)) {
            taskKeyToParentTasksMap[targetTaskKey] = [
                ...parentTasks,
                parentTask,
            ];
        }
    }

    const taskRankInSecondaryBranch = findSecondaryBranches(
        graph,
        taskKeyToParentTasksMap
    );

    const maxRank = Math.max(
        ...graph.tasks.map((task) =>
            getColumnIndex(task, taskRankInSecondaryBranch)
        )
    );

    const grid: GridT = initEmptyGrid(workerNames, maxRank);
    addTasksToGrid(grid, graph.tasks, taskRankInSecondaryBranch);

    computeRowsHeight(grid.rows);
    computeRowsY(grid);
    computeCellsX(grid.rows);

    orderTasksInEachCell(grid.rows, taskKeyToParentTasksMap);
    computeTasksRelativePositionInCell(grid.rows, taskRankInSecondaryBranch);

    const positionedTasks = graph.tasks.map((task) => {
        const row = grid.rows[task.worker];
        const cell = row.cells[getColumnIndex(task, taskRankInSecondaryBranch)];
        const taskInCell = cell.tasks.find((taskInCell) => {
            return taskInCell.taskRef.key === task.key;
        });

        return {
            ...task,
            position: {
                x: cell.x + (taskInCell as TaskInCellT).relativeXInCell,
                y: row.y + cell.y + (taskInCell as TaskInCellT).relativeYInCell,
            },
        };
    });

    return {
        tasks: positionedTasks,
        edges: graph.edges,
    };
}
