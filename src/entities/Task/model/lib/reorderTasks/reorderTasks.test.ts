import { reorderTasks } from './reorderTasks'
import type { Tables } from '@/shared/types/database'

type TaskRow = Tables<'tasks'>

const tasksMock: TaskRow[] = [
  {
    id: 'task-1',
    column_id: 'column-1',
    title: 'Task 1',
    description: null,
    due_date: null,
    position: 0,
    created_at: '2026-08-31T00:00:00.000Z',
  },
  {
    id: 'task-2',
    column_id: 'column-1',
    title: 'Task 2',
    description: null,
    due_date: null,
    position: 1,
    created_at: '2026-08-31T00:00:00.000Z',
  },
  {
    id: 'task-3',
    column_id: 'column-1',
    title: 'Task 3',
    description: null,
    due_date: null,
    position: 2,
    created_at: '2026-08-31T00:00:00.000Z',
  },
  {
    id: 'task-4',
    column_id: 'column-1',
    title: 'Task 4',
    description: null,
    due_date: null,
    position: 3,
    created_at: '2026-08-31T00:00:00.000Z',
  },
]

describe('reorderTasks', () => {
  test('moves a task to a later position', () => {
    const expectedTaskIds = ['task-1', 'task-2', 'task-4', 'task-3']
    const deepCopy = structuredClone(tasksMock)
    const reorderedTasks = reorderTasks(tasksMock, 'task-3', 3)
    const reorderedTaskIds = reorderedTasks.map((task) => task.id)

    expect(reorderedTaskIds).toEqual(expectedTaskIds)
    expect(tasksMock).toEqual(deepCopy)
  })
  test('moves a task to an earlier position', () => {
    const expectedTaskIds = ['task-1', 'task-3', 'task-2', 'task-4']
    const reorderedTasks = reorderTasks(tasksMock, 'task-3', 1)
    const reorderedTaskIds = reorderedTasks.map((task) => task.id)

    expect(reorderedTaskIds).toEqual(expectedTaskIds)
  })
  test('keeps the order when moved to the same position', () => {
    const expectedTaskIds = ['task-1', 'task-2', 'task-3', 'task-4']
    const reorderedTasks = reorderTasks(tasksMock, 'task-3', 2)
    const reorderedTaskIds = reorderedTasks.map((task) => task.id)

    expect(reorderedTaskIds).toEqual(expectedTaskIds)
  })
  test('recalculates task positions after reordering', () => {
    const expectedTaskPositions = [0, 1, 2, 3]
    const reorderedTasks = reorderTasks(tasksMock, 'task-3', 3)
    const reorderedTaskPositions = reorderedTasks.map((task) => task.position)

    expect(reorderedTaskPositions).toEqual(expectedTaskPositions)
  })
  test('returns a copy when the task is not found', () => {
    const expectedTaskIds = ['task-1', 'task-2', 'task-3', 'task-4']
    const reorderedTasks = reorderTasks(tasksMock, 'task-5', 3)
    const reorderedTaskIds = reorderedTasks.map((task) => task.id)

    expect(reorderedTaskIds).toEqual(expectedTaskIds)
    expect(reorderedTasks).not.toBe(tasksMock)
  })
  test('throws when the new position is less than zero', () => {
    expect(() => reorderTasks(tasksMock, 'task-3', -1)).toThrow(RangeError)
  })
  test('throws when the new position exceeds the last index', () => {
    expect(() => reorderTasks(tasksMock, 'task-3', 10)).toThrow(RangeError)
  })
})
