import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'

export interface TaskCardProps {
  title: string
  description?: string
  dueDate?: string
}

const TaskCard = (props: TaskCardProps) => {
  const { title, description, dueDate } = props

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-kanbo-heading">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      {dueDate && (
        <CardContent>
          <p className="bg-task-due text-kanbo-label w-fit rounded-md px-2.5">Due {dueDate}</p>
        </CardContent>
      )}
    </Card>
  )
}

export default TaskCard
