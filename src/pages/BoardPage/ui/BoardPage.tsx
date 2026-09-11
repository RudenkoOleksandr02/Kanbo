import { TaskColumn, type TaskLabelsFieldProps } from '@/entities/Task'
import { LogoutButton } from '@/features/Logout'
import { useGetBoardQuery } from '@/entities/Board'
import { Button } from '@/shared/ui/Button'
import { CreateTask } from '@/features/CreateTask'
import { EditTask, type SelectedTask } from '@/features/EditTask'
import { useState } from 'react'
import { DeleteTask } from '@/features/DeleteTask'
import { DragDropProvider } from '@dnd-kit/react'
import { useTaskDragAndDrop } from '@/features/ReorderTasks'
import { LabelsPopover } from '@/features/SelectTaskLabels'
import { TaskLabelBadge } from '@/entities/TaskLabel'

const BoardPage = () => {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null)
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null)
  const { isLoading, isFetching, data: boardData, error, refetch } = useGetBoardQuery()
  const { draftColumns, isSavingTaskOrder, handleDragStart, handleDragOver, handleDragEnd } =
    useTaskDragAndDrop(boardData?.columns ?? [])

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
  const columns = draftColumns ?? boardData.columns
  const initialColumn = columns.find((column) => column.position === 0)

  const renderLabelsField = (fieldProps: TaskLabelsFieldProps) => (
    <LabelsPopover boardId={boardData.id} availableLabels={boardData.labels} {...fieldProps} />
  )

  return (
    <main className="p-10">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-kanbo-heading text-[32px] font-bold">{title}</h1>
        <p className="text-kanbo-muted text-sm">{description}</p>
        <LogoutButton />
        {initialColumn && (
          <CreateTask columnId={initialColumn.id} renderLabelsField={renderLabelsField} />
        )}
        {selectedTask && (
          <EditTask
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            renderLabelsField={renderLabelsField}
          />
        )}
        <DeleteTask taskId={taskIdToDelete} onClose={() => setTaskIdToDelete(null)} />
      </div>
      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-kanbo-board flex overflow-x-auto rounded-md p-2">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              isDragDisabled={isSavingTaskOrder}
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
                    dueDate: task.due_date ?? '',
                    labelIds: task.labels.map((label) => label.id),
                  }),
                onDelete: () => setTaskIdToDelete(task.id),
                labelsSlot: task.labels.length ? (
                  <div className="flex flex-wrap gap-1">
                    {task.labels.map((label) => (
                      <TaskLabelBadge key={label.id} label={label} />
                    ))}
                  </div>
                ) : null,
              }))}
            />
          ))}
        </div>
      </DragDropProvider>
    </main>
  )
}

export default BoardPage
