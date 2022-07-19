import {
    LayoutedTaskGraphT,
    EdgeT,
    TaskGraphT,
    TaskT,
} from '@/modules/cpWorkflow/CPWorkflowTypes';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 119;

const NODE_BOTTOM_MARGIN = 51; // Add margin to the node height avoid stacking nodes
const ROW_BOTTOM_MARGIN = 30;
const TEST_TASK_LEFT_PADDING = 60;
const AGGREGATE_TASK_TOP_PADDING = 60;
const CELL_WIDTH = NODE_WIDTH + TEST_TASK_LEFT_PADDING + 90;

type TaskInCellT = {
    taskRef: TaskT;
    relativeXInCell: number;
    relativeYInCell: number;
};

type GridCellT = {
    tasks: TaskInCellT[];
    x: number;
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
            cells: Array.from({ length: maxRank + 1 }, () => ({
                tasks: [],
                x: 0,
            })),
            y: 0,
            height: 0,
        };
    }
    return grid;
}

function addTasksToGrid(grid: GridT, tasks: TaskT[]) {
    // Assign tasks to their cell
    for (const task of tasks) {
        const cell = grid.rows[task.worker].cells[task.rank];
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
        if (index == 0) {
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

function orderTasksInEachCell(rows: RowsT, edges: EdgeT[]) {
    const taskKeyToUpstreamEdgeMap: { [task_key: string]: EdgeT[] } = {};
    for (const edge of edges) {
        const taskUpstreamEdges =
            taskKeyToUpstreamEdgeMap[edge.target_task_key] ?? [];
        taskKeyToUpstreamEdgeMap[edge.target_task_key] = [
            ...taskUpstreamEdges,
            edge,
        ];
    }

    for (const row of Object.values(rows)) {
        for (const cell of row.cells) {
            cell.tasks.sort((firstTask, secondTask) => {
                function makeSortName(task: TaskT) {
                    if (task.category == TaskCategory.test) {
                        // test_tuples should follow their parentTask if it is in the cell
                        // So we concatenate the key of their parentTasks to their key to build a name used for sorting
                        const upstreamTaskKeys = taskKeyToUpstreamEdgeMap[
                            task.key
                        ]?.map((edge) => edge.source_task_key);
                        return upstreamTaskKeys?.join() + task.key;
                    } else {
                        return task.key;
                    }
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

function computeTasksRelativePositionInCell(rows: RowsT) {
    function computeTaskRelativePositionInCell(
        task: TaskInCellT,
        cell: GridCellT
    ) {
        task.relativeXInCell = 0;
        task.relativeYInCell =
            cell.tasks.indexOf(task) * (NODE_HEIGHT + NODE_BOTTOM_MARGIN);

        if (task.taskRef.category === TaskCategory.test) {
            // Testtuples are drawn with a little shifting on the x axis
            // to symbolize they are executed after the other tasks of the same rank
            task.relativeXInCell += TEST_TASK_LEFT_PADDING;
        }
        if (task.taskRef.category == TaskCategory.aggregate) {
            // Aggregatetuple are drawn with a little shifting on the y axis
            // to avoid they are drawn on top of composite-to-composite edges of the same worker
            task.relativeYInCell += AGGREGATE_TASK_TOP_PADDING;
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

export function computeLayout(graph: TaskGraphT): LayoutedTaskGraphT {
    const workerNames = [...new Set(graph.tasks.map((task) => task.worker))];
    workerNames.sort();

    const maxRank = Math.max(...graph.tasks.map((task) => task.rank));

    const grid: GridT = initEmptyGrid(workerNames, maxRank);
    addTasksToGrid(grid, graph.tasks);

    computeRowsHeight(grid.rows);
    computeRowsY(grid);
    computeCellsX(grid.rows);

    orderTasksInEachCell(grid.rows, graph.edges);
    computeTasksRelativePositionInCell(grid.rows);

    const positionedTasks = graph.tasks.map((task) => {
        const row = grid.rows[task.worker];
        const cell = row.cells[task.rank];
        const taskInCell = cell.tasks.find((taskInCell) => {
            return taskInCell.taskRef.key == task.key;
        });

        return {
            ...task,
            position: {
                x: cell.x + (taskInCell as TaskInCellT).relativeXInCell,
                y: row.y + (taskInCell as TaskInCellT).relativeYInCell,
            },
        };
    });

    return {
        tasks: positionedTasks,
        edges: graph.edges,
    };
}
