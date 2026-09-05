import { act, renderHook } from '@testing-library/react'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/react'
import type { BoardData } from '@/entities/Board'
import { useTaskDragAndDrop } from './useTaskDragAndDrop'

const { saveTaskOrderMock, unwrapMock, mutationState } = vi.hoisted(() => ({
  saveTaskOrderMock: vi.fn(),
  unwrapMock: vi.fn(),
  mutationState: {
    isLoading: false,
  },
}))

vi.mock('../api/saveTaskOrderApi', () => ({
  useSaveTaskOrderMutation: () => [
    saveTaskOrderMock,
    {
      isLoading: mutationState.isLoading,
    },
  ],
}))

vi.mock('@dnd-kit/react/sortable', async (importOriginal) => {
  const original = await importOriginal<typeof import('@dnd-kit/react/sortable')>()

  return {
    ...original,
    isSortable: (item: unknown) => item !== null && typeof item === 'object' && 'index' in item,
  }
})

const columnsMock = [
  {
    id: 'column-1',
    board_id: 'board-1',
    title: 'Not started',
    position: 0,
    created_at: '2026-09-05T00:00:00.000Z',
    tasks: [
      {
        id: 'task-1',
        column_id: 'column-1',
        title: 'Task 1',
        description: null,
        due_date: null,
        position: 0,
        created_at: '2026-09-05T00:00:00.000Z',
      },
      {
        id: 'task-2',
        column_id: 'column-1',
        title: 'Task 2',
        description: null,
        due_date: null,
        position: 1,
        created_at: '2026-09-05T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'column-2',
    board_id: 'board-1',
    title: 'In progress',
    position: 1,
    created_at: '2026-09-05T00:00:00.000Z',
    tasks: [
      {
        id: 'task-3',
        column_id: 'column-2',
        title: 'Task 3',
        description: null,
        due_date: null,
        position: 0,
        created_at: '2026-09-05T00:00:00.000Z',
      },
    ],
  },
  {
    id: 'column-3',
    board_id: 'board-1',
    title: 'Blocked',
    position: 1,
    created_at: '2026-09-05T00:00:00.000Z',
    tasks: [],
  },
] satisfies BoardData['columns']

describe('useTaskDragAndDrop', () => {
  beforeEach(() => {
    saveTaskOrderMock.mockReset()
    unwrapMock.mockReset()
    mutationState.isLoading = false

    saveTaskOrderMock.mockReturnValue({
      unwrap: unwrapMock,
    })
    unwrapMock.mockResolvedValue([])
  })

  test('moves a task to another column and recalculates positions', () => {
    const preventDefaultMock = vi.fn()
    const dragOverEvent = {
      preventDefault: preventDefaultMock,
      operation: {
        source: {
          id: 'task-2',
          index: 1,
          group: 'column-1',
        },
        target: {
          id: 'task-3',
          index: 0,
          group: 'column-2',
        },
      },
    } as unknown as DragOverEvent

    const { result } = renderHook(() => useTaskDragAndDrop(columnsMock))

    act(() => {
      result.current.handleDragStart()
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })

    const sourceTasks = result.current.draftColumns?.find(
      (column) => column.id === 'column-1',
    )?.tasks
    const targetTasks = result.current.draftColumns?.find(
      (column) => column.id === 'column-2',
    )?.tasks

    expect(preventDefaultMock).toHaveBeenCalledTimes(1)
    expect(sourceTasks?.map((task) => task.id)).toEqual(['task-1'])
    expect(sourceTasks?.map((task) => task.position)).toEqual([0])
    expect(targetTasks?.map((task) => task.id)).toEqual(['task-2', 'task-3'])
    expect(targetTasks?.map((task) => task.position)).toEqual([0, 1])
    expect(targetTasks?.[0]).toMatchObject({
      id: 'task-2',
      column_id: 'column-2',
    })
  })
  test('moves a task into an empty column', () => {
    const preventDefaultMock = vi.fn()
    const dragOverEvent = {
      preventDefault: preventDefaultMock,
      operation: {
        source: {
          id: 'task-2',
          index: 1,
          group: 'column-1',
        },
        target: {
          id: 'column-3',
          type: 'column',
        },
      },
    } as unknown as DragOverEvent
    const { result } = renderHook(() => useTaskDragAndDrop(columnsMock))

    act(() => {
      result.current.handleDragStart()
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })

    const sourceTasks = result.current.draftColumns?.find(
      (column) => column.id === 'column-1',
    )?.tasks
    const targetTasks = result.current.draftColumns?.find(
      (column) => column.id === 'column-3',
    )?.tasks

    expect(preventDefaultMock).toHaveBeenCalledTimes(1)
    expect(sourceTasks?.map((task) => task.id)).toEqual(['task-1'])
    expect(sourceTasks?.map((task) => task.position)).toEqual([0])
    expect(targetTasks?.map((task) => task.id)).toEqual(['task-2'])
    expect(targetTasks?.map((task) => task.position)).toEqual([0])
    expect(targetTasks?.[0]).toMatchObject({
      id: 'task-2',
      column_id: 'column-3',
    })
  })
  test('moves a task between columns without creating duplicates', () => {
    const preventDefaultMock = vi.fn()
    const dragOverEvent = {
      preventDefault: preventDefaultMock,
      operation: {
        source: {
          id: 'task-2',
          index: 1,
          group: 'column-1',
        },
        target: {
          id: 'task-3',
          index: 0,
          group: 'column-2',
        },
      },
    } as unknown as DragOverEvent
    const { result } = renderHook(() => useTaskDragAndDrop(columnsMock))

    act(() => {
      result.current.handleDragStart()
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })

    const allTaskIds = result.current.draftColumns?.flatMap((column) =>
      column.tasks.map((task) => task.id),
    )

    const movedTaskIds = allTaskIds?.filter((id) => id === 'task-2')

    expect(preventDefaultMock).toHaveBeenCalledTimes(2)
    expect(movedTaskIds).toHaveLength(1)
    expect(allTaskIds).toHaveLength(3)
  })
  test('saves both affected columns after a cross-column drop', async () => {
    const dragOverEvent = {
      preventDefault: vi.fn(),
      operation: {
        source: {
          id: 'task-2',
          index: 1,
          group: 'column-1',
        },
        target: {
          id: 'task-3',
          index: 0,
          group: 'column-2',
        },
      },
    } as unknown as DragOverEvent
    const dragEndEvent = {
      canceled: false,
      operation: dragOverEvent.operation,
    } as unknown as DragEndEvent
    const { result } = renderHook(() => useTaskDragAndDrop(columnsMock))

    act(() => {
      result.current.handleDragStart()
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })
    await act(async () => {
      await result.current.handleDragEnd(dragEndEvent)
    })

    expect(saveTaskOrderMock).toHaveBeenCalledWith({
      columnOrders: [
        {
          columnId: 'column-1',
          tasks: [
            expect.objectContaining({
              id: 'task-1',
              column_id: 'column-1',
              position: 0,
            }),
          ],
        },
        {
          columnId: 'column-2',
          tasks: [
            expect.objectContaining({
              id: 'task-2',
              column_id: 'column-2',
              position: 0,
            }),
            expect.objectContaining({
              id: 'task-3',
              column_id: 'column-2',
              position: 1,
            }),
          ],
        },
      ],
    })
    expect(saveTaskOrderMock).toHaveBeenCalledTimes(1)
    expect(unwrapMock).toHaveBeenCalledTimes(1)
    expect(result.current.draftColumns).toBeNull()
  })

  test('does not save when the drag is canceled', async () => {
    const dragOverEvent = {
      preventDefault: vi.fn(),
      operation: {
        source: {
          id: 'task-2',
          index: 1,
          group: 'column-1',
        },
        target: {
          id: 'task-3',
          index: 0,
          group: 'column-2',
        },
      },
    } as unknown as DragOverEvent
    const canceledDragEndEvent = {
      canceled: true,
      operation: dragOverEvent.operation,
    } as unknown as DragEndEvent
    const { result } = renderHook(() => useTaskDragAndDrop(columnsMock))

    act(() => {
      result.current.handleDragStart()
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })
    await act(async () => {
      await result.current.handleDragEnd(canceledDragEndEvent)
    })

    expect(saveTaskOrderMock).not.toHaveBeenCalled()
    expect(unwrapMock).not.toHaveBeenCalled()
    expect(result.current.draftColumns).toBeNull()
  })

  test('does not update drag state while task order is saving', () => {
    mutationState.isLoading = true
    const preventDefaultMock = vi.fn()
    const dragOverEvent = {
      preventDefault: preventDefaultMock,
      operation: {
        source: {
          id: 'task-2',
          index: 1,
          group: 'column-1',
        },
        target: {
          id: 'task-3',
          index: 0,
          group: 'column-2',
        },
      },
    } as unknown as DragOverEvent
    const { result } = renderHook(() => useTaskDragAndDrop(columnsMock))

    act(() => {
      result.current.handleDragStart()
    })
    act(() => {
      result.current.handleDragOver(dragOverEvent)
    })

    expect(result.current.isSavingTaskOrder).toBe(true)
    expect(result.current.draftColumns).toBeNull()
    expect(preventDefaultMock).not.toHaveBeenCalled()
    expect(saveTaskOrderMock).not.toHaveBeenCalled()
  })
})
