import { Button } from '@/shared/ui/Button'
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/Dialog'
import { useForm } from 'react-hook-form'
import { TaskForm, taskFormSchema, type TaskFormValues } from '@/entities/Task'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTaskMutation } from '../api/createTaskApi.ts'
import { useState } from 'react'

const CreateTask = ({ columnId }: { columnId: string }) => {
  const [open, setOpen] = useState(false)

  const [createTask, { isLoading, isError, reset: resetMutation }] = useCreateTaskMutation()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const onCreateSubmit = async (data: TaskFormValues) => {
    try {
      await createTask({
        ...data,
        columnId,
      }).unwrap()

      form.reset()
      setOpen(false)
    } catch (caughtError) {
      console.error(caughtError)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && isLoading) {
          return
        }

        setOpen(nextOpen)

        if (!nextOpen) {
          form.reset()
          resetMutation()
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline">Add Task</Button>} />
      <DialogContent className="sm:max-w-sm">
        <TaskForm
          form={form}
          onSubmit={onCreateSubmit}
          isError={isError}
          isLoading={isLoading}
          dialogTitle="Create task"
          errorMessage="Failed to create task. Please try again."
        />
      </DialogContent>
    </Dialog>
  )
}

export default CreateTask
