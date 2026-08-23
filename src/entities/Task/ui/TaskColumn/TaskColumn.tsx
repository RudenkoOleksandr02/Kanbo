import TaskCard, { type TaskCardProps } from '../TaskCard/TaskCard.tsx'

interface TaskColumnItem extends TaskCardProps {
  id: string
}

interface TaskColumnProps {
  title: string
  tasks: TaskColumnItem[]
}

const TaskColumn = (props: TaskColumnProps) => {
  const { title, tasks } = props

  if (!tasks.length) {
    return (
      <section>
        <h2>{title}</h2>
        <p>No tasks</p>
      </section>
    )
  }

  return (
    <section>
      <h2>{title}</h2>
      {tasks.map((task) => {
        return (
          <TaskCard
            key={task.id}
            title={task.title}
            description={task.description}
            dueDate={task.dueDate}
          />
        )
      })}
    </section>
  )
}

export default TaskColumn
