import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'

export interface TaskCardProps {
  title: string
  onEdit: () => void
  description?: string
  dueDate?: string
}

const TaskCard = (props: TaskCardProps) => {
  const { title, onEdit, description, dueDate } = props

  return (
    <Card className="w-full pb-0">
      <CardHeader>
        <CardTitle className="text-kanbo-heading">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      {dueDate && (
        <CardContent>
          <p className="bg-task-due text-kanbo-label w-fit rounded-md px-2.5">Due {dueDate}</p>
        </CardContent>
      )}
      <Button variant="ghost" type="button" aria-label={`Edit task ${title}`} onClick={onEdit}>
        Edit
      </Button>
    </Card>
  )
}

export default TaskCard
