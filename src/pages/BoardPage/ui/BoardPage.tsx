import { TaskColumn } from '@/entities/Task'

const BoardPage = () => {
  const tasks = [
    {
      id: '1',
      title: 'title 1',
      description: 'description 1',
      dueDate: '31 августа',
    },
    {
      id: '2',
      title: 'title 2',
      description: 'description 2',
      dueDate: '29 августа',
    },
    {
      id: '3',
      title: 'title 3',
      description: 'description 3',
      dueDate: '25 августа',
    },
  ]

  return (
    <main>
      <h1>My board</h1>
      <div>
        <TaskColumn title="Доска 1" tasks={tasks} />
      </div>
    </main>
  )
}

export default BoardPage
