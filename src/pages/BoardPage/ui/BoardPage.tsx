import { TaskColumn } from '@/entities/Task'
import { LogoutButton } from '@/features/Logout'
import { useGetBoardQuery } from '@/entities/Board'
import { Button } from '@/shared/ui/Button'
import { CreateTask } from '@/features/CreateTask'
import { EditTask, type SelectedTask } from '@/features/EditTask'
import { useState } from 'react'

const BoardPage = () => {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null)
  const { isLoading, isFetching, data: boardData, error, refetch } = useGetBoardQuery()

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

  const { title, description, columns } = boardData
  const initialColumn = columns.find((column) => column.position === 0)

  return (
    <main className="p-10">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-kanbo-heading text-[32px] font-bold">{title}</h1>
        <p className="text-kanbo-muted text-sm">{description}</p>
        <LogoutButton />
        {initialColumn && <CreateTask columnId={initialColumn.id} />}
        {selectedTask && <EditTask task={selectedTask} onClose={() => setSelectedTask(null)} />}
      </div>
      <div className="bg-kanbo-board flex overflow-x-auto rounded-md p-2">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
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
            }))}
          />
        ))}
      </div>
    </main>
  )
}

export default BoardPage
