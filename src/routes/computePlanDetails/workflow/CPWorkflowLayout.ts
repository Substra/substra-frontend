import { LayoutedTaskGraphT, TaskGraphT, TaskT } from '@/types/CPWorkflowTypes';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 119;

const NODE_BOTTOM_MARGIN = 71; // Add margin to the node height to avoid stacking nodes
const ROW_BOTTOM_MARGIN = 30;
const CELL_WIDTH = NODE_WIDTH + 150;

type TaskInCellT = {
    taskRef: TaskT;
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

// Gives the column index of a task
// If a task is part of a secondary branch, it is placed on the rank (column index) of its oldest parent inside this branch
function getColumnIndex(
    task: TaskT,
    taskRankInSecondaryBranch: { [task_key: string]: number }
) {
    const correctedRank: number =
        task.rank - (taskRankInSecondaryBranch[task.key] ?? 0);
    return Math.max(0, correctedRank);
}

// Adds all tasks to the grid and places them in their respective cell
function addTasksToGrid(
    grid: GridT,
    tasks: TaskT[],
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

// Sets rows height depending on the max number of tasks they have in a branch
function computeRowsHeight(rows: RowsT) {
    for (const row of Object.values(rows)) {
        row.height =
            row.maxNbTasksInACell * (NODE_HEIGHT + NODE_BOTTOM_MARGIN) +
            ROW_BOTTOM_MARGIN;
    }
}

// Places each node row in vertical axis
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

// Places cell in the horizontal axis
function computeCellsX(rows: RowsT) {
    for (const row of Object.values(rows)) {
        for (const [index, cell] of row.cells.entries()) {
            cell.x = index * CELL_WIDTH;
        }
    }
}

// Puts tasks in each cell in the correct order
function orderTasksInEachCell(
    rows: RowsT,
    taskKeyToParentTasksMap: { [task_key: string]: TaskT[] }
) {
    for (const row of Object.values(rows)) {
        for (const cell of row.cells) {
            // Identify the rank of the cell
            const minRank = Math.min(
                ...cell.tasks.map((task) => task.taskRef.rank)
            );

            // orderedTasks is going to be an array with all the tasks of the cell ordered
            // we begin by pushing every task that have the normal rank for the cell
            // (= tasks who are not children of another task inside the cell)
            const orderedTasks = cell.tasks.filter(
                (task) => task.taskRef.rank === minRank
            );

            // we sort all of the other tasks that are children
            const childTasks = cell.tasks
                .filter((task) => task.taskRef.rank !== minRank)
                .sort((first, second) => {
                    if (first.taskRef.rank < second.taskRef.rank) {
                        return -1;
                    } else if (first.taskRef.rank > second.taskRef.rank) {
                        return 1;
                    }
                    return 0;
                });

            // for each child task we find its closest parent among the already ordered task
            // then insert the child task right after its parent
            for (const childTask of childTasks) {
                const parents = taskKeyToParentTasksMap[childTask.taskRef.key];
                let closestParent = null;
                if (parents.length === 1) {
                    closestParent = parents[0];
                } else if (parents.length > 1) {
                    closestParent = parents.find(
                        (parent) => parent.rank === childTask.taskRef.rank - 1
                    );
                }

                for (const [index, task] of orderedTasks.entries()) {
                    if (
                        closestParent &&
                        task.taskRef.key === closestParent.key
                    ) {
                        orderedTasks.splice(index + 1, 0, childTask);
                        break;
                    }
                }
            }
            cell.tasks = orderedTasks;
        }
    }
}

// Places tasks in their correct position inside each cell
// A cell is a case on the workflow grid with nodes in ordinate & ranks in abscissa
function computeTasksRelativePositionInCell(
    rows: RowsT,
    taskRankInSecondaryBranch: { [task_key: string]: number }
) {
    function computeTaskRelativePositionInCell(
        task: TaskInCellT,
        cell: GridCellT
    ) {
        const rankInSecondaryBranch =
            taskRankInSecondaryBranch[task.taskRef.key] ?? 0;

        task.relativeXInCell = rankInSecondaryBranch * 30;
        task.relativeYInCell =
            cell.tasks.indexOf(task) * (NODE_HEIGHT + NODE_BOTTOM_MARGIN);
    }

    for (const row of Object.values(rows)) {
        for (const cell of row.cells) {
            for (const task of cell.tasks) {
                computeTaskRelativePositionInCell(task, cell);
            }
        }
    }
}

// Creates branches by looking for task with no children (generally outputting performances)
// This effectively makes a group with a train, predict and test task arranged vertically on the graph
function findSecondaryBranches(
    graph: TaskGraphT,
    taskKeyToParentTasksMap: { [task_key: string]: TaskT[] }
): { [task_key: string]: number } {
    function producesOnlyPerformances(task: TaskT) {
        const outputKinds = new Set(
            Object.values(task.outputs_specs).map((output) => output.kind)
        );
        return (
            outputKinds.size === 1 &&
            outputKinds.values().next().value === 'ASSET_PERFORMANCE'
        );
    }

    function computeNbOfChildren(graph: TaskGraphT, task: TaskT) {
        return graph.edges.filter((edge) => edge.source_task_key === task.key)
            .length;
    }

    // Recursive function to walk through parent tasks as long as it is a linear chain to find the secondary branch
    function findSecondaryBranch(
        task: TaskT,
        taskKeyToParentTasksMap: { [task_key: string]: TaskT[] },
        tasksInSecondaryBranches: { [task_key: string]: number }
    ) {
        const parents: TaskT[] = Object.values(
            taskKeyToParentTasksMap[task.key] ?? []
        );
        if (parents.length === 0) {
            // The secondary branch is not connected to the rest of the workflow
            // Let us not tune the layout for this specific case. Could be a single train task chain
            return null;
        } else if (parents.length === 1) {
            // The task as only one parent, so we can create a secondary branch.
            tasksInSecondaryBranches[task.key] = 1;
            return tasksInSecondaryBranches[task.key];
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
        findSecondaryBranch(
            task,
            taskKeyToParentTasksMap,
            taskRanksInSecondaryBranch
        );
    }

    return taskRanksInSecondaryBranch;
}

export function computeLayout(graph: TaskGraphT): LayoutedTaskGraphT {
    const workerNames = [...new Set(graph.tasks.map((task) => task.worker))];
    workerNames.sort();

    const taskKeyToTaskMap: { [task_key: string]: TaskT } = {};
    for (const task of graph.tasks) {
        taskKeyToTaskMap[task.key] = task;
    }

    const taskKeyToParentTasksMap: { [task_key: string]: TaskT[] } = {};
    for (const edge of graph.edges) {
        const targetTaskKey = edge.target_task_key;
        const parentTask = taskKeyToTaskMap[edge.source_task_key];

        const parentTasks = taskKeyToParentTasksMap[targetTaskKey] ?? [];
        if (
            parentTask && // Could be undefined if the parent task is in another CP
            !parentTasks.includes(parentTask)
        ) {
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
