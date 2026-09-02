import TaskCard, { type TaskCardProps } from '../TaskCard/TaskCard.tsx'

interface TaskColumnProps {
  tasks: Omit<TaskCardProps, 'index' | 'columnId'>[]
  title: string
  columnId: string
}

const TaskColumn = (props: TaskColumnProps) => {
  const { columnId, tasks, title } = props

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
          />
        ))
      ) : (
        <p>No tasks</p>
      )}
    </section>
  )
}

export default TaskColumn
