import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { useSortable } from '@dnd-kit/react/sortable'

export interface TaskCardProps {
  id: string
  index: number
  columnId: string
  title: string
  onEdit: () => void
  onDelete: () => void
  description?: string
  dueDate?: string
}

const TaskCard = (props: TaskCardProps) => {
  const { id, index, columnId, title, onEdit, onDelete, description, dueDate } = props
  const { ref } = useSortable({
    id,
    index,
    group: columnId,
    type: `${columnId}:item`,
    accept: [`${columnId}:item`],
  })

  return (
    <Card className="w-full" ref={ref}>
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
