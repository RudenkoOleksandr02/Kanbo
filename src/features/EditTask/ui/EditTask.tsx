import { Dialog, DialogContent } from '@/shared/ui/Dialog'
import { TaskForm, taskFormSchema, type TaskFormValues } from '@/entities/Task'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateTaskMutation } from '../api/updateTaskApi.ts'

export type SelectedTask = TaskFormValues & {
  id: string
}

interface EditTaskProps {
  task: SelectedTask
  onClose: () => void
}

const EditTask = ({ task, onClose }: EditTaskProps) => {
  const [updateTask, { isLoading, isError, reset: resetMutation }] = useUpdateTaskMutation()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
    },
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isLoading) {
      return
    }

    if (!nextOpen) {
      form.reset()
      resetMutation()
      onClose()
    }
  }

  const onEditSubmit = async (values: TaskFormValues) => {
    try {
      await updateTask({
        ...values,
        taskId: task.id,
      }).unwrap()

      handleOpenChange(false)
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <TaskForm
          form={form}
          onSubmit={onEditSubmit}
          isError={isError}
          isLoading={isLoading}
          dialogTitle="Edit task"
          errorMessage="Failed to update task. Please try again."
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditTask
