import { TaskCard } from '@/entities/Task'

const BoardPage = () => {
  return (
    <main>
      <h1>My board</h1>
      <div>
        <TaskCard
          title="Сделать авторизацию"
          description="Добавить вход через Supabase"
          dueDate="25 августа"
        />
      </div>
    </main>
  )
}

export default BoardPage
