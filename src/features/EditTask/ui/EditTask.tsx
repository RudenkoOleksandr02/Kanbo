import { Dialog, DialogContent } from '@/shared/ui/Dialog'
import {
  type RenderTaskLabelsField,
  TaskForm,
  taskFormSchema,
  type TaskFormValues,
} from '@/entities/Task'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateTaskMutation } from '../api/updateTaskApi.ts'
import { useState } from 'react'

export type SelectedTask = TaskFormValues & {
  id: string
}

interface EditTaskProps {
  task: SelectedTask
  onClose: () => void
  renderLabelsField: RenderTaskLabelsField
}

const EditTask = (props: EditTaskProps) => {
  const { task, onClose, renderLabelsField } = props
  const [isCreatingLabel, setIsCreatingLabel] = useState(false)
  const [updateTask, { isLoading: isSubmitting, isError, reset: resetMutation }] =
    useUpdateTaskMutation()

  const isBusy = isSubmitting || isCreatingLabel

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      labelIds: task.labelIds,
    },
  })

  const closeDialog = () => {
    form.reset()
    resetMutation()
    setIsCreatingLabel(false)
    onClose()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isBusy) return

    if (!nextOpen) closeDialog()
  }

  const onEditSubmit = async (values: TaskFormValues) => {
    try {
      await updateTask({
        ...values,
        taskId: task.id,
      }).unwrap()

      closeDialog()
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton={!isBusy}>
        <TaskForm
          form={form}
          onSubmit={onEditSubmit}
          isError={isError}
          isSubmitting={isSubmitting}
          isBusy={isBusy}
          dialogTitle="Edit task"
          errorMessage="Failed to update task. Please try again."
          renderLabelsField={renderLabelsField}
          onLabelsBusyChange={setIsCreatingLabel}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditTask
