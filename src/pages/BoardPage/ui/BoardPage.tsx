import { TaskColumn } from '@/entities/Task'
import { LogoutButton } from '@/features/Logout'

const BoardPage = () => {
  const tasks = [
    {
      id: '1',
      status: 'Not started',
      title: 'Take Coco to a vet',
      dueDate: '4/11',
    },
    {
      id: '2',
      status: 'In progress',
      title: 'Taxes 😔',
    },
    {
      id: '3',
      status: 'Blocked',
      title: 'Move',
      description: 'Survive moving places in the pandemic.',
    },
    {
      id: '4',
      status: 'Done',
      title: 'Nothing to be done 🙃',
    },
  ]
  const title = 'Personal'
  const description = 'A board to keep track of personal tasks.'
  const statuses = ['Not started', 'In progress', 'Blocked', 'Done']

  return (
    <main className="p-10">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-kanbo-heading text-[32px] font-bold">{title}</h1>
        <p className="text-kanbo-muted text-sm">{description}</p>
        <LogoutButton />
      </div>
      <div className="bg-kanbo-board flex overflow-x-auto rounded-md p-2">
        {statuses.map((status) => (
          <TaskColumn
            key={status}
            title={status}
            tasks={tasks.filter((task) => task.status === status)}
          />
        ))}
      </div>
    </main>
  )
}

export default BoardPage
