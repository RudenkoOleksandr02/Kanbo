import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'

export interface TaskCardProps {
  title: string
  onEdit: () => void
  onDelete: () => void
  description?: string
  dueDate?: string
}

const TaskCard = (props: TaskCardProps) => {
  const { title, onEdit, onDelete, description, dueDate } = props

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
      <CardFooter>
        <Button
          variant="destructive"
          type="button"
          aria-label={`Delete task ${title}`}
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button variant="default" type="button" aria-label={`Edit task ${title}`} onClick={onEdit}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TaskCard
