import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/Card'

interface TaskCardProps {
  title: string
  description: string
  dueDate: string
}

const TaskCard = (props: TaskCardProps) => {
  const { title, description, dueDate } = props

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardFooter>
        <p>Срок: {dueDate}</p>
      </CardFooter>
    </Card>
  )
}

export default TaskCard
