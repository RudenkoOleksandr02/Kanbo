import { useState } from 'react'
import type { BoardData } from '@/entities/Board'
import { useSaveTaskOrderMutation } from '../api/saveTaskOrderApi'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import { reorderTasks } from '@/entities/Task'

export const useTaskDragAndDrop = (columns: BoardData['columns'] | null) => {
  const [draftColumns, setDraftColumns] = useState<BoardData['columns'] | null>(null)
  const [saveTaskOrder, { isLoading: isSavingTaskOrder }] = useSaveTaskOrderMutation()

  const handleDragStart = () => {
    if (isSavingTaskOrder) return

    setDraftColumns(columns)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (isSavingTaskOrder) return

    const { source, target } = event.operation

    if (!isSortable(source) || !target) return

    const taskId = source.id

    if (typeof taskId !== 'string') return

    let targetColumnId: string
    let sortableTargetIndex: number | undefined

    if (isSortable(target)) {
      if (typeof target.group !== 'string') return

      targetColumnId = target.group
      sortableTargetIndex = target.index
    } else {
      if (target.type !== 'column' || typeof target.id !== 'string') return

      targetColumnId = target.id
    }

    event.preventDefault()

    setDraftColumns((currentColumns) => {
      if (!currentColumns) return currentColumns

      const sourceColumn = currentColumns.find((column) =>
        column.tasks.some((task) => task.id === taskId),
      )
      const targetColumn = currentColumns.find((column) => column.id === targetColumnId)

      if (!sourceColumn || !targetColumn) return currentColumns

      const currentIndex = sourceColumn.tasks.findIndex((task) => task.id === taskId)
      const targetIndex =
        sortableTargetIndex ??
        (sourceColumn.id === targetColumn.id
          ? Math.max(targetColumn.tasks.length - 1, 0)
          : targetColumn.tasks.length)

      if (sourceColumn.id === targetColumn.id && currentIndex === targetIndex) {
        return currentColumns
      }

      if (sourceColumn.id === targetColumn.id) {
        return currentColumns.map((column) =>
          column.id === sourceColumn.id
            ? {
                ...column,
                tasks: reorderTasks(column.tasks, taskId, targetIndex),
              }
            : column,
        )
      }

      const sourceTasks = sourceColumn.tasks
        .filter((task) => task.id !== taskId)
        .map((task, index) => ({
          ...task,
          position: index,
        }))
      const movedTask = sourceColumn.tasks[currentIndex]

      if (!movedTask) return currentColumns

      const taskInTargetColumn = {
        ...movedTask,
        column_id: targetColumn.id,
      }
      const targetTasks = reorderTasks(
        [...targetColumn.tasks, taskInTargetColumn],
        taskId,
        targetIndex,
      )

      return currentColumns.map((column) => {
        if (column.id === sourceColumn.id) {
          return { ...column, tasks: sourceTasks }
        }
        if (column.id === targetColumn.id) {
          return { ...column, tasks: targetTasks }
        }

        return column
      })
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { source, target } = event.operation

    if (
      event.canceled ||
      !isSortable(source) ||
      !target ||
      (!isSortable(target) && target.type !== 'column') ||
      typeof source.id !== 'string' ||
      !draftColumns ||
      !columns
    ) {
      setDraftColumns(null)
      return
    }

    const taskId = source.id
    const originalColumn = columns.find((column) => column.tasks.some((task) => task.id === taskId))
    const finalColumn = draftColumns.find((column) =>
      column.tasks.some((task) => task.id === taskId),
    )

    if (!originalColumn || !finalColumn) {
      setDraftColumns(null)
      return
    }

    const originalIndex = originalColumn.tasks.findIndex((task) => task.id === taskId)
    const finalIndex = finalColumn.tasks.findIndex((task) => task.id === taskId)

    if (originalColumn.id === finalColumn.id && originalIndex === finalIndex) {
      setDraftColumns(null)
      return
    }

    const changedColumnIds = new Set([originalColumn.id, finalColumn.id])
    const columnOrders = draftColumns
      .filter((column) => changedColumnIds.has(column.id))
      .map((column) => ({
        columnId: column.id,
        tasks: column.tasks,
      }))

    try {
      await saveTaskOrder({ columnOrders }).unwrap()
    } catch (caughtError) {
      console.error(caughtError)
    } finally {
      setDraftColumns(null)
    }
  }

  return { draftColumns, isSavingTaskOrder, handleDragStart, handleDragOver, handleDragEnd }
}
