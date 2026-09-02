import { reorderTasks, TaskColumn } from '@/entities/Task'
import { LogoutButton } from '@/features/Logout'
import { type BoardData, useGetBoardQuery } from '@/entities/Board'
import { Button } from '@/shared/ui/Button'
import { CreateTask } from '@/features/CreateTask'
import { EditTask, type SelectedTask } from '@/features/EditTask'
import { useEffect, useState } from 'react'
import { DeleteTask } from '@/features/DeleteTask'
import { DragDropProvider, type DragEndEvent } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'

const BoardPage = () => {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null)
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null)
  const { isLoading, isFetching, data: boardData, error, refetch } = useGetBoardQuery()
  const [localColumns, setLocalColumns] = useState<BoardData['columns']>([])

  useEffect(() => {
    if (boardData) {
      // Sync fetched data with the local DnD state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalColumns(boardData.columns)
    }
  }, [boardData])

  if (isLoading) return <div>Loading...</div>
  if (error) {
    return (
      <div>
        <p>Failed to load board</p>
        <Button disabled={isFetching} onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    )
  }
  if (!boardData) return <div>Board not found</div>

  const { title, description } = boardData
  const initialColumn = localColumns.find((column) => column.position === 0)

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source } = event.operation

    if (isSortable(source)) {
      const { index, initialIndex, id, group, initialGroup } = source

      if (
        group == null ||
        initialGroup !== group ||
        initialIndex === index ||
        typeof id !== 'string'
      )
        return

      setLocalColumns((columns) => {
        return columns.map((column) => {
          if (column.id === group) {
            return {
              ...column,
              tasks: reorderTasks(column.tasks, id, index),
            }
          }
          return column
        })
      })
    }
  }

  return (
    <main className="p-10">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-kanbo-heading text-[32px] font-bold">{title}</h1>
        <p className="text-kanbo-muted text-sm">{description}</p>
        <LogoutButton />
        {initialColumn && <CreateTask columnId={initialColumn.id} />}
        {selectedTask && <EditTask task={selectedTask} onClose={() => setSelectedTask(null)} />}
        <DeleteTask taskId={taskIdToDelete} onClose={() => setTaskIdToDelete(null)} />
      </div>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="bg-kanbo-board flex overflow-x-auto rounded-md p-2">
          {localColumns.map((column) => (
            <TaskColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              tasks={column.tasks.map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description ?? undefined,
                dueDate: task.due_date ?? undefined,
                onEdit: () =>
                  setSelectedTask({
                    id: task.id,
                    title: task.title,
                    description: task.description ?? '',
                  }),
                onDelete: () => setTaskIdToDelete(task.id),
              }))}
            />
          ))}
        </div>
      </DragDropProvider>
    </main>
  )
}

export default BoardPage
