import TaskCard, { type TaskCardProps } from '../TaskCard/TaskCard.tsx'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'

interface TaskColumnProps {
  tasks: Omit<TaskCardProps, 'index' | 'columnId' | 'isDragDisabled'>[]
  title: string
  columnId: string
  isDragDisabled?: boolean
}

const TaskColumn = (props: TaskColumnProps) => {
  const { columnId, tasks, title, isDragDisabled } = props
  const { ref } = useDroppable({
    id: columnId,
    type: 'column',
    accept: ['item'],
    collisionPriority: CollisionPriority.Low,
    disabled: isDragDisabled,
  })

  const statusColorClasses: Record<string, string> = {
    'Not started': 'bg-status-not-started',
    'In progress': 'bg-status-in-progress',
    Blocked: 'bg-status-blocked',
    Done: 'bg-status-done',
  }
  const statusColorClass = statusColorClasses[title] ?? 'bg-white'

  return (
    <section className="m-3 flex max-w-[284px] min-w-[208px] flex-1 flex-col gap-3">
      <h2 className={`text-kanbo-label w-fit rounded-md px-3 ${statusColorClass}`}>{title}</h2>
      <div ref={ref} className="flex min-h-24 flex-1 flex-col gap-3">
        {tasks.length ? (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              id={task.id}
              index={index}
              columnId={columnId}
              title={task.title}
              description={task.description}
              dueDate={task.dueDate}
              onEdit={task.onEdit}
              onDelete={task.onDelete}
              isDragDisabled={isDragDisabled}
            />
          ))
        ) : (
          <p>No tasks</p>
        )}
      </div>
    </section>
  )
}

export default TaskColumn
