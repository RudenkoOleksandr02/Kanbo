import { Button } from '@/shared/ui/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/Dialog'
import { useForm } from 'react-hook-form'
import {
  type RenderTaskLabelsField,
  TaskForm,
  taskFormSchema,
  type TaskFormValues,
} from '@/entities/Task'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTaskMutation } from '../api/createTaskApi.ts'
import { useState } from 'react'

interface CreateTaskProps {
  columnId: string
  renderLabelsField: RenderTaskLabelsField
}

const CreateTask = (props: CreateTaskProps) => {
  const { columnId, renderLabelsField } = props
  const [open, setOpen] = useState(false)
  const [isCreatingLabel, setIsCreatingLabel] = useState(false)

  const [createTask, { isLoading: isSubmitting, isError, reset: resetMutation }] =
    useCreateTaskMutation()

  const isBusy = isSubmitting || isCreatingLabel

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      labelIds: [],
    },
  })

  const closeDialog = () => {
    form.reset()
    resetMutation()
    setIsCreatingLabel(false)
    setOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isBusy) return

    if (nextOpen) {
      setOpen(true)
      return
    }

    closeDialog()
  }

  const onCreateSubmit = async (data: TaskFormValues) => {
    try {
      await createTask({
        ...data,
        columnId,
      }).unwrap()

      closeDialog()
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline">Add Task</Button>} />
      <DialogContent className="sm:max-w-sm" showCloseButton={!isBusy}>
        <TaskForm
          form={form}
          onSubmit={onCreateSubmit}
          isError={isError}
          isSubmitting={isSubmitting}
          isBusy={isBusy}
          dialogTitle="Create task"
          errorMessage="Failed to create task. Please try again."
          renderLabelsField={renderLabelsField}
          onLabelsBusyChange={setIsCreatingLabel}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateTask
