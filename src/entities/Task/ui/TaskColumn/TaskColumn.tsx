import TaskCard, { type TaskCardProps } from '../TaskCard/TaskCard.tsx'

interface TaskColumnItem extends TaskCardProps {
  id: string
}

interface TaskColumnProps {
  tasks: TaskColumnItem[]
  title: string
}

const TaskColumn = (props: TaskColumnProps) => {
  const { tasks, title } = props
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
        tasks.map((task) => {
          return (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              dueDate={task.dueDate}
            />
          )
        })
      ) : (
        <p>No tasks</p>
      )}
    </section>
  )
}

export default TaskColumn
